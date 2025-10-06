import { React, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Form.css";

function DonationForm() {
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [pickupTime, setPickupTime] = useState("");

  return (
    <div className="form">
      <Navbar />

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
              <li>Select an appropriate pickup time slot.</li>
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
              marginBottom: 0
            }}
          >
            <i>*All fields are required</i>
          </p>

          <div className="form-left">
            <p>FOOD TYPE</p>
            <select id="foodType" name="foodType" required>
              <option value="" disabled selected hidden>
                Select Food Type
              </option>
              <option value="cooked">Cooked Meal</option>
              <option value="fruits_veggies">Fresh Fruits/Vegetables</option>
              <option value="packaged">Packaged Goods</option>
            </select>

            <p>QUANTITY</p>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity (kg or boxes)"
              required
            />

            <p>ADDRESS</p>
            <input
              type="text"
              id="pickupAddress"
              name="pickupAddress"
              placeholder="Enter pickup address"
              required
            />

            <p>PICKUP TIME SLOT</p>
            <select
              id="pickupTime"
              name="pickupTime"
              required
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Select Time Slot
              </option>
              <option value="asap">As Soon as Possible</option>
              <option value="2hours">Within 2 hours</option>
              <option value="custom">Select Specific Time</option>
            </select>

            {pickupTime === "custom" && (
              <>
                <p>SELECT SPECIFIC TIME</p>
                <select id="specificTime" name="specificTime" required>
                  <option value="">Select Time</option>
                  <option value="8am-10am">8 AM - 10 AM</option>
                  <option value="10am-12pm">10 AM - 12 PM</option>
                  <option value="12pm-2pm">12 PM - 2 PM</option>
                  <option value="2pm-4pm">2 PM - 4 PM</option>
                  <option value="4pm-6pm">4 PM - 6 PM</option>
                  <option value="6pm-8pm">6 PM - 8 PM</option>
                </select>
              </>
            )}

            <p>CONTACT DETAILS</p>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              placeholder="Phone number or email"
              required
            />

            <p>SPECIAL INSTRUCTIONS</p>
            <input
              type="text"
              id="specialInstructions"
              name="specialInstructions"
              placeholder="e.g., Keep refrigerated, Spicy food"
            />

            <button type="submit" className="submit-button">
              Submit Donation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DonationForm;
