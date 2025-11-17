import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import headerPNG from "../assets/IMG_9076.PNG";
import celebrate from "../assets/wired-outline-1103-confetti-hover-pinch.gif";

function Receiver() {
  const donationsData = [
  {
    id: 1,
    type: "Food",
    date: "2025-11-10",
    address: "Maskan Chowrangi, Gulshan-e-Iqbal, Karachi",
    coordinates: [24.920728, 67.092209],
    caption: "Fresh Homemade Biryani",
    smart_tags: "non-veg",
    ingredients: ["Basmati Rice", "Chicken", "Onions", "Yogurt", "Spices"],
    azure_tags: [
      "Indian",
      "Rice-based",
      "Non-vegetarian",
      "Aromatic",
      "Cooked",
      "Dinner",
      "Restaurant-quality",
      "Spiced",
      "Fragrant",
      "Meal",
    ],
    storage: "refrigerated",
    expiry: "2-3 days",
    allergens: ["Sesame", "Celery"],
    meal_type: "dinner",
    food_category: "cooked",
  },
  {
    id: 2,
    type: "Food",
    date: "2025-11-08",
    address: "Ferozepur Road, Model Town, Lahore",
    coordinates: [31.482773, 74.329376],
    caption: "Packaged Organic Cereal Boxes",
    smart_tags: "vegetarian",
    ingredients: ["Oats", "Honey", "Almonds", "Raisins"],
    azure_tags: [
      "Breakfast",
      "Organic",
      "Packaged",
      "Vegetarian",
      "Healthy",
      "Nutritious",
      "Convenient",
      "Shelf-stable",
      "Whole Grain",
      "Energy",
    ],
    storage: "room temperature",
    expiry: "6 months",
    allergens: ["Tree Nuts", "Gluten"],
    meal_type: "breakfast",
    food_category: "packaged",
  },
  {
    id: 3,
    type: "Food",
    date: "2025-11-12",
    address: "University Road (near Islamia College), Peshawar",
    coordinates: [34.007965, 71.560135],
    caption: "Fresh Vegetables Bundle",
    smart_tags: "vegetarian",
    ingredients: [
      "Tomatoes",
      "Cucumbers",
      "Bell Peppers",
      "Green Beans",
      "Carrots",
    ],
    azure_tags: [
      "Vegetables",
      "Fresh",
      "Raw",
      "Organic",
      "Vegetarian",
      "Healthy",
      "Natural",
      "Farmers Market",
      "Seasonal",
      "Crispy",
    ],
    storage: "room temperature",
    expiry: "5-7 days",
    allergens: "None",
    meal_type: "snack",
    food_category: "fresh_raw",
  },
  {
    id: 4,
    type: "Food",
    date: "2025-11-09",
    address: "Bank Road, Saddar, Rawalpindi",
    coordinates: [33.597553, 73.051544],
    caption: "Homemade Chicken Karahi",
    smart_tags: "non-veg",
    ingredients: [
      "Chicken",
      "Tomatoes",
      "Ginger",
      "Garlic",
      "Green Peppers",
      "Spices",
    ],
    azure_tags: [
      "Pakistani",
      "Non-vegetarian",
      "Cooked",
      "Spiced",
      "Authentic",
      "Aromatic",
      "Traditional",
      "Dinner",
      "Savory",
      "Meal",
    ],
    storage: "refrigerated",
    expiry: "1-2 days",
    allergens: ["Garlic"],
    meal_type: "dinner",
    food_category: "cooked",
  },
  {
    id: 5,
    type: "Food",
    date: "2025-11-07",
    address: "Badar Commercial Street 10, DHA Phase 5, Karachi",
    coordinates: [24.813015, 67.067825],
    caption: "Fresh Mixed Fruits Collection",
    smart_tags: "vegetarian",
    ingredients: ["Apples", "Bananas", "Oranges", "Mangoes", "Strawberries"],
    azure_tags: [
      "Fruits",
      "Fresh",
      "Raw",
      "Vegetarian",
      "Healthy",
      "Nutritious",
      "Natural",
      "Vitamins",
      "Organic",
      "Seasonal",
    ],
    storage: "room temperature",
    expiry: "4-6 days",
    allergens: "None",
    meal_type: "snack",
    food_category: "fresh_raw",
  },
  {
    id: 6,
    type: "Food",
    date: "2025-11-11",
    address: "Fortress Stadium, Cantt, Lahore",
    coordinates: [31.535289, 74.363556],
    caption: "Packaged Biscuits & Cookies Assortment",
    smart_tags: "vegetarian",
    ingredients: [
      "Wheat Flour",
      "Sugar",
      "Butter",
      "Vanilla Extract",
      "Baking Soda",
    ],
    azure_tags: [
      "Biscuits",
      "Packaged",
      "Vegetarian",
      "Breakfast",
      "Snack",
      "Sweet",
      "Convenient",
      "Long-shelf-life",
      "Bakery",
      "Treats",
    ],
    storage: "room temperature",
    expiry: "8 months",
    allergens: ["Wheat", "Dairy", "Eggs"],
    meal_type: "snack",
    food_category: "packaged",
  },
];

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showAcceptOptions, setShowAcceptOptions] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("");
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
  });
  const [deliveryError, setDeliveryError] = useState("");
  ({ street: "", city: "" });
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const filteredDonations = donationsData.filter(
    (d) => filter === "All" || d.food_category === filter
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    return sort === "Newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  const handleAcceptDonation = (donation) => {
    setSelectedDonation(donation);
    setShowAcceptOptions(true);
  };

  const handleSelfPickup = () => {
    setShowAcceptOptions(false);
    setDetailsView(false);
    setConfirmationMessage("Donation accepted! Proceed with self‑pickup.");
  };

  const handleDelivery = () => {
    setShowAcceptOptions(false);
    setShowDeliveryForm(true);
  };

  const handleSubmitDelivery = () => {
    if (!deliveryAddress.street || !deliveryAddress.city) {
      setDeliveryError("Please enter both street address and city.");
      return;
    }

    setDeliveryError("");
    setShowDeliveryForm(false);
    setDetailsView(false);
    setConfirmationMessage(true);
  };

  return (
    <div
      className="form"
      style={{
        paddingTop: "80px",
      }}
    >
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />

      <div className="donations-body">
        <div className="filter-sort-bar">
          <div className="location-toggle-container">
            <label>Location-based</label>
            <button
              className={`location-toggle ${locationBased ? "active" : ""}`}
              onClick={() => setLocationBased(!locationBased)}
            >
              <span className="toggle-ball"></span>
            </button>
          </div>
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>cooked</option>
              <option>packaged</option>
              <option>fresh_raw</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <section className="donations">
          <div className="donation-list">
            {sortedDonations.map((donation, index) => (
              <div
                key={donation.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="donation-info">
                  <h3 className="donation-type">{donation.caption}</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={calendar}
                      style={{
                        width: "6%",
                      }}
                    />
                    <div className="donation-date">
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={pin}
                      style={{
                        width: "6%",
                      }}
                    />
                    <div className="donation-address">{donation.address}</div>
                  </div>
                </div>

                <div className="donation-actions">
                  <button className="accept-btn" onClick={() => handleAcceptDonation(selectedDonation)}
              >Accept Donation</button>
                  <button
                    className="details-btn"
                    onClick={() => {
                      setSelectedDonation(donation);
                      setDetailsView(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {detailsView && selectedDonation && (
        <>
          <div
            className="overlay-screen"
            onClick={() => setDetailsView(false)}
          />
          <div className="details-modal">
            <button
              className="close-details-btn"
              onClick={() => setDetailsView(false)}
            >
              ✕
            </button>

            <div className="details-header">
              <h2 className="details-caption">{selectedDonation.caption}</h2>
              <p className="details-type">
                Expiry Date: {selectedDonation.expiry}
              </p>
            </div>

            <div className="details-content">
              {/* Address & Date with Map */}
              <div className="details-section">
                <h3>Pickup Location</h3>
                {selectedDonation.coordinates && (
                  <MapComponent lat={selectedDonation.coordinates[0]} lon={selectedDonation.coordinates[1]} />
                )}
                <div className="detail-item" style={{ marginTop: "1rem" }}>
                  <span className="detail-label">Pickup Address:</span>
                  <span className="detail-value">
                    {selectedDonation.address}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date Posted:</span>
                  <span className="detail-value">
                    {new Date(selectedDonation.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Food-specific details */}
              {/* Smart Tags */}
              <div className="details-section">
                <h3>Food Type</h3>
                <div className="tags-container">
                  <span className="tag">{selectedDonation.smart_tags}</span>
                </div>
              </div>

              {/* Meal Type */}
              <div className="details-section">
                <h3>Meal Type</h3>
                <div className="tags-container">
                  <span className="tag meal-tag">
                    {selectedDonation.meal_type}
                  </span>
                </div>
              </div>

              {/* Storage & Expiry */}
              <div className="details-section">
                <div className="detail-item">
                  <span className="detail-label">Storage:</span>
                  <span className="detail-value">
                    {selectedDonation.storage}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Shelf Life:</span>
                  <span className="detail-value">
                    {selectedDonation.expiry}
                  </span>
                </div>
              </div>

              {/* Ingredients */}
              {selectedDonation.ingredients &&
                selectedDonation.ingredients.length > 0 && (
                  <div className="details-section">
                    <h3>Ingredients</h3>
                    <div className="tags-container">
                      {selectedDonation.ingredients.map((ingredient, idx) => (
                        <span key={idx} className="tag ingredient-tag">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Allergens */}
              {selectedDonation.allergens &&
                selectedDonation.allergens !== "None" && (
                  <div className="details-section allergen-warning">
                    <h3>Allergens</h3>
                    <div className="tags-container">
                      {Array.isArray(selectedDonation.allergens) ? (
                        selectedDonation.allergens.map((allergen, idx) => (
                          <span key={idx} className="tag allergen-tag">
                            {allergen}
                          </span>
                        ))
                      ) : (
                        <span className="detail-value">
                          {selectedDonation.allergens}
                        </span>
                      )}
                    </div>
                  </div>
                )}

              {/* Azure Tags */}
            </div>

            <button
              className="accept-details-btn"
              onClick={() => handleAcceptDonation(selectedDonation)}
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "large",
              }}
            >
              Accept Donation
            </button>
          </div>
        </>
      )}

      {/* ACCEPT OPTIONS MODAL */}
      {showAcceptOptions && (
        <>
          <div
            className="overlay-screen"
            style={{
              zIndex: 4000,
            }}
            onClick={() => setShowAcceptOptions(false)}
          />
          <div
            className="details-modal"
            style={{
              zIndex: 5000,
            }}
          >
            <button
              className="close-details-btn"
              onClick={() => setShowAcceptOptions(false)}
            >
              ✕
            </button>
            <h2>Select Delivery Method</h2>

            <div className="accept-options">
              <button
                className="accept-btn"
                onClick={()=> {
                  handleSelfPickup();
                  setDeliveryMode("self");
                }}
                style={{
                  fontSize: "large",
                }}
              >
                Self Pickup
              </button>

              <button
                className="accept-btn"
                onClick={()=> {
                  handleDelivery();
                  setDeliveryMode("delivery");
                }}
                style={{
                  fontSize: "large",
                }}
              >
                Get Delivered
              </button>
            </div>
          </div>
        </>
      )}

      {/* DELIVERY ADDRESS FORM */}
      {showDeliveryForm && (
        <>
          <div
            className="overlay-screen"
            style={{
              zIndex: 4000,
            }}
            onClick={() => setShowDeliveryForm(false)}
          />
          <div
            className="details-modal"
            style={{
              zIndex: 5000,
            }}
          >
            <button
              className="close-details-btn"
              onClick={() => setShowDeliveryForm(false)}
            >
              ✕
            </button>

            <h2
              style={{
                padding: 0,
              }}
            >
              Enter Delivery Address
            </h2>

            <div className="delivery-form">
              {deliveryError && (
                <div
                  className="error-message"
                  style={{
                    color: "red",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {deliveryError}
                </div>
              )}
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

              <button
                className="accept-btn"
                onClick={() => {
                  setDeliveryError("");
                  setShowDeliveryForm(false);
                  setDetailsView(false);
                  setConfirmationMessage(true);
                }}
                style={{
                  fontSize: "large",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </>
      )}

      {/* CONFIRMATION MESSAGE */}
      {confirmationMessage && (
        <>
          <div className="overlay-screen" />
          <div className="details-modal" style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            gap: "1rem", 
            height: "fit-content",
            padding: "2rem 1rem",
          }}>
            <img src={celebrate} style={{
              width: "25%",
            }}/>
            <div style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "DM Mono",
            }}>
              <span style={{
                color: "#e2d7a0",
                padding: "0.5rem 0 1rem 0"
              }}>Donation accepted! </span> <br/> 
              <span style={{
                letterSpacing: "2px",
              }}>- Team Naimat</span>
            </div>

            <button className="accept-btn"
            onClick={()=>setConfirmationMessage(false)}>Acknowledged!</button>
            {deliveryMode === "self" && (
              <button className="details-btn">Receive Donor's Details</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Receiver;
