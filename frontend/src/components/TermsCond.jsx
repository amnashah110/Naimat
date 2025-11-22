import React, { useState } from "react";
import "../styles/terms-conditions.css";

function TermsCond({ userType = "donor", onAgree, onDisagree, deliveryMode = "self-pickup" }) {
  const [agreementStates, setAgreementStates] = useState({
    contactInfo: false,
    foodQuality: false,
    expiryDate: false,
    legalCompliance: false,
    reliabilityCommitment: false,
  });

  const [allAgreed, setAllAgreed] = useState(false);

  const handleCheckboxChange = (field) => {
    const newStates = {
      ...agreementStates,
      [field]: !agreementStates[field],
    };
    setAgreementStates(newStates);

    // Check if all checkboxes are checked
    const allChecked = Object.values(newStates).every((val) => val === true);
    setAllAgreed(allChecked);
  };

  const handleAgree = () => {
    if (allAgreed && onAgree) {
      onAgree();
    }
  };

  const handleDisagree = () => {
    if (onDisagree) {
      onDisagree();
    }
  };

  const getDonorTerms = () => (
    <div className="terms-content">
      <h3>Donor Terms & Conditions</h3>

      <div className="terms-section">
        <h4>1. Contact Information Sharing</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.contactInfo}
            onChange={() => handleCheckboxChange("contactInfo")}
          />
          <span>
            I understand and agree that my contact information (name, phone number, email, and delivery address) will be shared with the {deliveryMode === "self-pickup" ? "recipient" : "volunteer"} to facilitate the donation pickup and delivery process. This information will be used solely for coordinating the donation transaction.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>2. Food Quality & Edibility</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.foodQuality}
            onChange={() => handleCheckboxChange("foodQuality")}
          />
          <span>
            I certify that the food I am donating is safe for human consumption, has been stored properly, is free from contamination, and meets all standard food safety guidelines. I acknowledge that I am responsible for the quality and safety of the donated food.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>3. Expiration Date Compliance</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.expiryDate}
            onChange={() => handleCheckboxChange("expiryDate")}
          />
          <span>
            I confirm that the food being donated has not passed its expiration date and will remain safe for consumption for a reasonable period after donation. I am responsible for providing accurate expiration date information for all donated items.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>4. Legal Compliance & Liability</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.legalCompliance}
            onChange={() => handleCheckboxChange("legalCompliance")}
          />
          <span>
            I agree to comply with all local, state, and federal food donation laws and regulations. I acknowledge that I am legally responsible for the food I donate and accept full liability for any foodborne illness or harm resulting from the consumed donated food. The platform is not liable for any consequences arising from the quality or safety of the donated food.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>5. Donation Accuracy & Description</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.reliabilityCommitment}
            onChange={() => handleCheckboxChange("reliabilityCommitment")}
          />
          <span>
            I agree to provide accurate and honest descriptions of the food being donated, including all ingredients, allergens, preparation methods, and storage conditions. Any misrepresentation of the food's quality or composition may result in account suspension or legal action.
          </span>
        </label>
      </div>
    </div>
  );

  const getRecipientTerms = () => (
    <div className="terms-content">
      <h3>Recipient Terms & Conditions</h3>

      <div className="terms-section">
        <h4>1. Contact Information Sharing</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.contactInfo}
            onChange={() => handleCheckboxChange("contactInfo")}
          />
          <span>
            I understand and agree that my contact information (name, phone number, email, and delivery address) will be shared with the donor {deliveryMode === "delivery" ? "and the volunteer assigned to deliver the donation" : "for the purpose of arranging food pickup"}. This information will be used solely for coordinating the donation transaction.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>2. Food Safety Acknowledgment</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.foodQuality}
            onChange={() => handleCheckboxChange("foodQuality")}
          />
          <span>
            I acknowledge receipt of donated food and agree to consume it within the specified timeframe. I am responsible for properly storing and handling the food after receipt. The platform is not liable for any foodborne illness resulting from improper storage or handling after delivery.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>3. Expiration Date Responsibility</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.expiryDate}
            onChange={() => handleCheckboxChange("expiryDate")}
          />
          <span>
            I will consume the donated food before its expiration date as specified by the donor. I agree to verify the expiration date at the time of receipt and report any discrepancies immediately. Consuming food past its expiration date is at my own risk.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>4. Liability & Legal Compliance</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.legalCompliance}
            onChange={() => handleCheckboxChange("legalCompliance")}
          />
          <span>
            I accept the donated food as-is and acknowledge that I have inspected it at the time of receipt. I agree not to hold the donor, volunteer, or platform liable for any foodborne illness or allergic reactions. I am fully responsible for checking ingredients and allergens before consumption.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>5. Respectful Conduct & Reliability</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.reliabilityCommitment}
            onChange={() => handleCheckboxChange("reliabilityCommitment")}
          />
          <span>
            I agree to conduct myself respectfully during food pickup or delivery. I commit to being available at the scheduled time or providing timely notice if I cannot accept the donation. Repeated failures to honor scheduled pickups may result in account suspension.
          </span>
        </label>
      </div>
    </div>
  );

  const getVolunteerTerms = () => (
    <div className="terms-content">
      <h3>Volunteer Terms & Conditions</h3>

      <div className="terms-section">
        <h4>1. Contact Information Sharing</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.contactInfo}
            onChange={() => handleCheckboxChange("contactInfo")}
          />
          <span>
            I understand and agree that my contact information (name, phone number, email, and current location) will be shared with both the donor and recipient to facilitate food delivery. This information will be used solely for coordinating the donation delivery process.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>2. Food Handling & Safety</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.foodQuality}
            onChange={() => handleCheckboxChange("foodQuality")}
          />
          <span>
            I agree to handle and transport the donated food in a safe and sanitary manner. I will ensure that the food is kept at the appropriate temperature (refrigerated if required) and will not be exposed to contamination during transit. I am responsible for maintaining food safety standards during delivery.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>3. Timely Delivery Before Expiration</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.expiryDate}
            onChange={() => handleCheckboxChange("expiryDate")}
          />
          <span>
            I commit to delivering the food to the recipient before its expiration date and time. I will plan my delivery route efficiently to minimize delivery time and ensure the food reaches the recipient in optimal condition. Any failure to deliver before expiration is a breach of this agreement.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>4. Liability & Legal Responsibility</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.legalCompliance}
            onChange={() => handleCheckboxChange("legalCompliance")}
          />
          <span>
            I acknowledge that I am delivering food between parties and understand my responsibility in the food chain. While I am not liable for the original food quality (responsibility of the donor), I am liable for any damage or contamination caused by improper handling during transit. I agree to comply with all food handling regulations.
          </span>
        </label>
      </div>

      <div className="terms-section">
        <h4>5. Reliability & Professional Conduct</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreementStates.reliabilityCommitment}
            onChange={() => handleCheckboxChange("reliabilityCommitment")}
          />
          <span>
            I commit to being a reliable volunteer and will conduct myself professionally with both donors and recipients. I agree to complete assigned deliveries on time and notify parties immediately if there are any delays or issues. Repeated failures to complete deliveries may result in removal from the volunteer program.
          </span>
        </label>
      </div>
    </div>
  );

  const renderTerms = () => {
    switch (userType) {
      case "donor":
        return getDonorTerms();
      case "recipient":
        return getRecipientTerms();
      case "volunteer":
        return getVolunteerTerms();
      default:
        return getDonorTerms();
    }
  };

  return (
    <>
      <div className="overlay-screen" onClick={handleDisagree} />
      <div className="terms-modal">
        <div className="terms-header">
          <h2>Terms & Conditions</h2>
          <button className="close-btn" onClick={handleDisagree}>✕</button>
        </div>

        <div className="terms-scroll">
          {renderTerms()}
        </div>

        <div className="terms-footer">
          <button className="disagree-btn" onClick={handleDisagree}>
            Disagree & Exit
          </button>
          <button
            className={`agree-btn ${allAgreed ? "active" : "disabled"}`}
            onClick={handleAgree}
            disabled={!allAgreed}
          >
            I Agree to All Terms
          </button>
        </div>
      </div>
    </>
  );
}

export default TermsCond;
