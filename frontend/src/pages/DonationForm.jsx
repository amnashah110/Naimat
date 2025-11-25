import { React, useState } from "react";
import Navbar from "../components/Navbar";
import AzureMapPicker from "../components/AzureMapPicker";
import "../styles/Form.css";
import headerPNG from "../assets/IMG_9076.PNG";
import upload from "../assets/upload-solid-full.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function DonationForm() {
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [foodType, setFoodType] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationTitle, setDonationTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showIndexingSpinner, setShowIndexingSpinner] = useState(false);

  const navigate = useNavigate();
  const { user, checkAuthError } = useUser();

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (!token || !user) {
      alert("Please log in to submit a donation");
      navigate("/"); // Redirect to home/login
      return;
    }

    // Validate all fields
    if (!donationTitle.trim()) {
      alert("Please enter a donation title");
      return;
    }

    if (!foodType) {
      alert("Please select a food type");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!selectedLocation) {
      alert("Please select a location on the map");
      return;
    }

    if (!uploadedFile) {
      alert("Please upload a picture of the food");
      return;
    }

    if (foodType === "packaged" && !expiry) {
      alert("Please provide an expiry date for packaged goods");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("description", donationTitle);
    formData.append("foodType", foodType);
    formData.append("quantity", quantity);
    formData.append("latitude", selectedLocation.coordinates[1].toString());
    formData.append("longitude", selectedLocation.coordinates[0].toString());
    
    if (specialInstructions) {
      formData.append("specialInstructions", specialInstructions);
    }
    
    if (foodType === "packaged" && expiry) {
      formData.append("expiry", expiry);
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch("http://localhost:3000/donation/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      // Check if authentication failed
      if (checkAuthError(response)) {
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }

      const result = await response.json();
      console.log("✅ Donation submitted successfully:", result);
      
      // Now add to Azure Search index via backend
      setShowIndexingSpinner(true);
      
      try {
        console.log("📤 Adding donation to search index via backend...");

        // Call backend endpoint to add to index
        const indexResponse = await fetch(
          `http://localhost:3000/donation/add-to-index/${result.foodPostId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if (indexResponse.ok) {
          const indexResult = await indexResponse.json();
          console.log("✅ Successfully added to Azure Search index:", indexResult);
        } else {
          const errorData = await indexResponse.json().catch(() => ({ message: 'Unknown error' }));
          console.error("⚠️ Failed to add to Azure Search index:", errorData);
          console.warn("⚠️ Indexing failed but donation was saved successfully. The donation may not appear in search results immediately.");
          // Don't fail the whole process if indexing fails
        }
      } catch (indexError) {
        console.error("⚠️ Error during indexing:", indexError);
        console.warn("⚠️ Indexing failed but donation was saved successfully.");
        // Don't fail the whole process if indexing fails
      } finally {
        setShowIndexingSpinner(false);
      }
      
      alert("Thank you! Your donation has been submitted successfully.");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert(`Failed to submit donation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form">
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />
      <div className="form-header">
        <div className="form-title">Donation Form</div>
      </div>

      <section className="form-body">
        <div className="form-right">
          {isFullScreen ? (
            <>
              <h1>DONATION GUIDELINES</h1>
            </>
          ) : (
            <>
              <h2>
                DONATION <br />
                GUIDELINES
              </h2>
            </>
          )}

          <div>
            <ul>
              <li>Provide accurate food type details.</li>
              <li>Mention correct quantity (in kg or meal boxes).</li>
              <li>Select your exact location on the map.</li>
              <li>
                Use "Special Instructions" for any important notes (optional).
              </li>
            </ul>
          </div>
        </div>

        <div>
          <p
            style={{
              textAlign: "center",
              color: "rgba(248, 241, 201, 1)",
              marginBottom: 0,
            }}
          >
            <i>*All fields are required</i>
          </p>

          <div className="form-left">
            <p>DONATION TITLE</p>
            <input
              type="text"
              id="donationcaption"
              name="donationcaption"
              value={donationTitle}
              onChange={(e) => setDonationTitle(e.target.value)}
              placeholder="e.g., Burger Meal, Chicken Biryani etc."
              required
              style={{
                marginTop: "0.8rem",
              }}
            />

            <p>FOOD TYPE</p>
            <select
              id="foodType"
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              style={{
                marginTop: "0.8rem",
              }}
            >
              <option value="" hidden>
                Select Food Type
              </option>
              <option value="cooked">Cooked Meal</option>
              <option value="raw">Fresh/Raw Food</option>
              <option value="packaged">Packaged Goods</option>
            </select>

            {foodType === "packaged" && (
              <>
                <p>BEST BEFORE DATE</p>
                <input
                  type="date"
                  id="bestBeforeDate"
                  name="bestBeforeDate"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#f2e9b9",
                    borderColor: "#f2e9b9",
                    padding: "0.5rem",
                    borderRadius: "5px",
                    border: "1px solid #f2e9b9",
                    cursor: "pointer",
                    marginTop: "0.8rem",
                  }}
                />
              </>
            )}

            <p>QUANTITY</p>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity (for e.g. kg or boxes)"
              required
              style={{
                marginTop: "0.8rem",
              }}
            />

            <p>LOCATION</p>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="submit-button"
              style={{
                width: "100%",
                maxWidth: "100%",
                marginTop: "0.8rem",
              }}
            >
              {selectedLocation ? "✓ Location Selected" : "📍 Select Location on Map"}
            </button>

            {/* Map Modal */}
            {showMapModal && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "20px"
              }}>
                <div style={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "12px",
                  padding: "20px",
                  width: "90%",
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <h3 style={{ margin: 0, color: "#f2e9b9" }}>Select Your Location</h3>
                    <button
                      onClick={() => setShowMapModal(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f2e9b9",
                        fontSize: "24px",
                        cursor: "pointer",
                        padding: "0",
                        width: "30px",
                        height: "30px"
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <AzureMapPicker 
                    onLocationSelect={handleLocationSelect}
                    initialCenter={[67.0011, 24.8607]}
                    initialZoom={11}
                    height="500px"
                  />
                </div>
              </div>
            )}

            <p>SPECIAL INSTRUCTIONS</p>
            <input
              type="text"
              id="specialInstructions"
              name="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Keep refrigerated, Spicy food"
            />


            <p>UPLOAD PICTURE</p>
            <label
              htmlFor="pictureUpload"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                padding: "0.3rem 1rem",
                backgroundColor: "transparent",
                border: "1.5px solid #f2e9b9",
                borderRadius: "8px",
                color: "#f2e9b9",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontSize: "0.95rem",
                fontWeight: "600",
                fontFamily: '"DM Mono"',
              }}
            >
              <img src={upload} style={{
                width: "1.2rem",
              }} />

              Upload Picture
            </label>
            <input
              type="file"
              id="pictureUpload"
              name="pictureUpload"
              accept="image/*"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              required
              style={{
                display: "none",
              }}
            />

            <button type="submit" className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Donation"}
            </button>


            {uploadedFile && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#f2e9b9",
                  marginTop: "0.4rem",
                  marginBottom: "0.5rem",
                }}
              >
                ✓ {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* INDEXING SPINNER MODAL */}
      {showIndexingSpinner && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              padding: "2.5rem 3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              border: "2px solid #f2e9b9",
              boxShadow: "0 4px 20px rgba(242, 233, 185, 0.3)"
            }}>
              {/* Spinner */}
              <div style={{
                width: "60px",
                height: "60px",
                border: "4px solid rgba(242, 233, 185, 0.2)",
                borderTop: "4px solid #f2e9b9",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              
              {/* Text */}
              <div style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "DM Mono",
                color: "#f2e9b9"
              }}>
                Adding donation to index...
              </div>
              
              <div style={{
                fontSize: "0.9rem",
                textAlign: "center",
                fontFamily: "DM Mono",
                color: "#e2d7a0",
                opacity: 0.8,
                maxWidth: "300px"
              }}>
                Please wait while we process your donation
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DonationForm;
