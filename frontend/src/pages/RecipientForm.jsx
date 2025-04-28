import { React, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Form.css";

function RecipientForm() {
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);

  return (
    <div className="form">
      <Navbar />

      <div className="form-header">
        <div className="form-title" style={{
          left: "18%"
        }}>REQUEST FORM</div>
      </div>

      <section className="form-body">
        <div className="form-left">
          <p>FOOD PREFERENCE</p>
          <select id="foodPreference" name="foodPreference" required>
            <option value="">Select Preference</option>
            <option value="any">Any</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="nonvegetarian">Non-Vegetarian</option>
            <option value="packaged">Packaged Only</option>
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
          <input
            type="text"
            id="deliveryAddress"
            name="deliveryAddress"
            placeholder="Enter delivery address"
            required
          />

          <p>URGENCY LEVEL</p>
          <select id="urgencyLevel" name="urgencyLevel" required>
            <option value="">Select Urgency</option>
            <option value="immediate">Immediate</option>
            <option value="withinaday">Within a day</option>
            <option value="nohurry">No Hurry</option>
          </select>

          <p>CONTACT INFO</p>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            placeholder="Phone number or email"
            required
          />

          <button type="submit" className="submit-button">
            Request Food
          </button>
        </div>

        <div className="form-right">
          {isFullScreen ? (
            <>
              <h1>REQUEST GUIDELINES</h1>
            </>
          ) : (
            <>
              <h1>REQUEST <br/>GUIDELINES</h1>
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
      </section>
    </div>
  );
}

export default RecipientForm;