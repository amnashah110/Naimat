import { React, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Form.css";

function RecipientForm() {
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [foodType, setFoodType] = useState("");
  const [contactCode, setContactCode] = useState("+92");
  const [contactNumber, setContactNumber] = useState("");

  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 7))
    .toISOString()
    .split("T")[0];

  return (
    <div className="form">
      <Navbar />

      <div className="form-header">
        <div
          className="form-title"
          style={{
            left: "18%",
          }}
        >
          Request Form
        </div>
      </div>

      <section className="form-body">
        <div className="form-right">
          {isFullScreen ? (
            <>
              <h1>REQUEST GUIDELINES</h1>
            </>
          ) : (
            <>
              <h1>
                REQUEST <br />
                GUIDELINES
              </h1>
            </>
          )}

          <div>
            <ul>
              <li>Select your correct food preference.</li>
              <li>Mention how much quantity you require.</li>
              <li>Provide an accurate delivery address.</li>
              <li>Choose the urgency level carefully.</li>
              <li>Provide a valid phone number or email.</li>
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
            <p>FOOD PREFERENCE</p>
            <select id="foodPreference" name="foodPreference" required>
              <option value="" disabled selected hidden>
                Select Preference
              </option>
              <option value="any">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="nonvegetarian">Non-Vegetarian</option>
            </select>

            <p>FOOD TYPE</p>
            <select
              id="foodType"
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select Type
              </option>
              <option value="packaged">Packaged / Canned Foods</option>
              <option value="any">Any Type</option>
            </select>

            <p>QUANTITY NEEDED</p>
            <input
              type="number"
              id="quantityNeeded"
              name="quantityNeeded"
              placeholder="Number of meals or kg"
              required
            />

            <p>DELIVERY ADDRESS</p>
            <div className="address-group">
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                placeholder="Street / House Address"
                required
              />
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                required
              />
            </div>

            <p>URGENCY LEVEL</p>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select Urgency
              </option>
              <option value="immediate">Immediate</option>
              <option value="inaweek">In a week (7 days)</option>
              <option value="withinadate">Till a certain date</option>
              <option value="nohurry">No Hurry</option>
            </select>

            {urgencyLevel === "withinadate" && (
              <>
                <p>DELIVERY DEADLINE</p>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  min={minDate}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  required
                  style={{ colorScheme: "dark" }} // optional dark mode styling
                />
              </>
            )}

            <button type="submit" className="submit-button">
              Request Food
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecipientForm;
