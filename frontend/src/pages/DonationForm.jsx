import { React, useState } from "react";
import Navbar from "../components/Navbar";
import AzureMapPicker from "../components/AzureMapPicker";
import "../styles/Form.css";
import headerPNG from "../assets/IMG_9076.PNG";
import upload from "../assets/upload-solid-full.svg";
import { useNavigate } from "react-router-dom";

function DonationForm() {
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [foodType, setFoodType] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [contactInfo, setContactInfo] = useState("");
  const [contactError, setContactError] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationTitle, setDonationTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const navigate = useNavigate();

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!contactInfo || contactError) {
      alert("Please provide valid contact details");
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
    formData.append("contact", contactInfo);
    
    if (specialInstructions) {
      formData.append("specialInstructions", specialInstructions);
    }
    
    if (foodType === "packaged" && expiry) {
      formData.append("expiry", expiry);
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch("https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }

      const result = await response.json();
      console.log("✅ Donation submitted successfully:", result);
      
      alert("Thank you! Your donation has been submitted successfully.");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert(`Failed to submit donation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateContact = (value) => {
    setContactInfo(value);
    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.trim() === "") {
      setContactError("Contact details are required");
    } else if (!phoneRegex.test(value) && !emailRegex.test(value)) {
      setContactError("Enter a valid 11-digit phone number or valid email");
    } else {
      setContactError("");
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
              <li>Provide a working phone number or email for contact.</li>
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

            <div>CONTACT DETAILS
              {contactError && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#ff6b6b",
                    marginTop: "0.2rem",
                    marginBottom: "0",
                  }}
                >
                  ⚠ {contactError}
                </p>
              )}
            </div>
            <div
              style={{
                minHeight: "4.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: contactError ? "flex-start" : "center",
              }}
            >
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={contactInfo}
                onChange={(e) => validateContact(e.target.value)}
                placeholder="11-digit phone number or email"
                required
              />

            </div>

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
    </div>
  );
}

export default DonationForm;
