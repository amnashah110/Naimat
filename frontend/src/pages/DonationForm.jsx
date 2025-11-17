import { React, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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

  const navigate = useNavigate();

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
              <li>Ensure pickup address is complete and clear.</li>
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
              placeholder="e.g., Burger Meal, Chicken Biryani etc."
              required
              style={{
                marginBottom: "1rem",
              }}
            />

            <p>FOOD TYPE</p>
            <select
              id="foodType"
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
            >
              <option value="" disabled selected hidden>
                Select Food Type
              </option>
              <option value="cooked">Cooked Meal</option>
              <option value="fruits_veggies">Fresh Fruits/Vegetables</option>
              <option value="packaged">Packaged Goods</option>
            </select>

            {foodType === "packaged" && (
              <>
                <p>BEST BEFORE DATE</p>
                <input
                  type="date"
                  id="bestBeforeDate"
                  name="bestBeforeDate"
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
                  }}
                />
              </>
            )}

            <p>QUANTITY</p>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity (kg or boxes)"
              required
            />

            <p>ADDRESS</p>
            <div className="address-group">
              <input
                type="text"
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Street / House Address"
                required
              />
              <select name="city" id="city" required>
                <option value="" disabled selected>
                  Select City
                </option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="multan">Multan</option>
                <option value="peshawar">Peshawar</option>
                <option value="quetta">Quetta</option>
                <option value="sialkot">Sialkot</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="gujranwala">Gujranwala</option>
                <option value="bahawalpur">Bahawalpur</option>
                <option value="sukkur">Sukkur</option>
                <option value="abbottabad">Abbottabad</option>
                <option value="mirpur">Mirpur</option>
              </select>
            </div>

            <div>
              CONTACT DETAILS
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
              <img
                src={upload}
                style={{
                  width: "1.2rem",
                }}
              />
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

            <button
              type="submit"
              className="submit-button"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Submit Donation
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
