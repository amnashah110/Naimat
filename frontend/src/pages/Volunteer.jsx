import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import applaud from "../assets/wired-outline-1092-applause-hover-pinch.gif";

function Volunteer() {
  const donationsData = [
    {
      id: 1,
      type: "Food",
      date: "2025-11-10",
      pickup_address: "Gulshan-e-Iqbal, Karachi",
      pickup_coordinates: [24.8515, 67.0738],
      destination_address: "Edhi Centre, Karachi",
      destination_coordinates: [24.8701, 67.0403],
      caption: "Fresh Homemade Biryani",
      smart_tags: "non-veg",
      ingredients: ["Basmati Rice", "Chicken", "Onions", "Yogurt", "Spices"],
      azure_tags: ["Indian", "Rice-based", "Non-vegetarian"],
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
      pickup_address: "Model Town, Lahore",
      pickup_coordinates: [31.5497, 74.3436],
      destination_address: "Saylani Welfare Centre, Lahore",
      destination_coordinates: [31.5204, 74.3587],
      caption: "Packaged Organic Cereal Boxes",
      smart_tags: "vegetarian",
      ingredients: ["Oats", "Honey", "Almonds", "Raisins"],
      azure_tags: ["Breakfast", "Organic", "Packaged"],
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
      pickup_address: "University Road, Peshawar",
      pickup_coordinates: [34.1526, 71.5769],
      destination_address: "Alkhidmat Centre, Peshawar",
      destination_coordinates: [34.0206, 71.5785],
      caption: "Fresh Vegetables Bundle",
      smart_tags: "vegetarian",
      ingredients: ["Tomatoes", "Cucumbers", "Bell Peppers"],
      azure_tags: ["Vegetables", "Fresh", "Organic"],
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
      pickup_address: "Saddar, Rawalpindi",
      pickup_coordinates: [33.5731, 73.1898],
      destination_address: "Edhi Home, Rawalpindi",
      destination_coordinates: [33.6, 73.05],
      caption: "Homemade Chicken Karahi",
      smart_tags: "non-veg",
      ingredients: ["Chicken", "Tomatoes", "Ginger"],
      azure_tags: ["Pakistani", "Spiced", "Dinner"],
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
      pickup_address: "Defence, Karachi",
      pickup_coordinates: [24.7898, 67.0756],
      destination_address: "Saylani Centre, Karachi",
      destination_coordinates: [24.86, 67.01],
      caption: "Fresh Mixed Fruits Collection",
      smart_tags: "vegetarian",
      ingredients: ["Apples", "Bananas", "Oranges"],
      azure_tags: ["Fruits", "Fresh", "Seasonal"],
      storage: "room temperature",
      expiry: "4-6 days",
      allergens: "None",
      meal_type: "snack",
      food_category: "fresh_raw",
    },
  ];

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(false);

  const filteredDonations = donationsData.filter(
    (d) => filter === "All" || d.food_category === filter
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    return sort === "Newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="form" style={{ paddingTop: "80px" }}>
      <Navbar />

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
            {sortedDonations.map((d, index) => (
              <div
                key={d.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="donation-info">
                  <h3 className="donation-type">{d.caption}</h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={calendar} style={{ width: "6%" }} />
                    <div className="donation-date">
                      {new Date(d.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Pickup */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={pin} style={{ width: "6%" }} />
                    <div className="donation-address">
                      <strong>Pickup:</strong> {d.pickup_address}
                    </div>
                  </div>

                  {/* Destination */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img src={pin} style={{ width: "6%" }} />
                    <div className="donation-address">
                      <strong>Destination:</strong> {d.destination_address}
                    </div>
                  </div>
                </div>

                <div
                  className="donation-actions"
                  onClick={() => {
                    setDetailsView(false);
                    setConfirmMessage(true);
                  }}
                >
                  <button className="accept-btn">Accept Pickup</button>
                  <button
                    className="details-btn"
                    onClick={() => {
                      setSelectedDonation(d);
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1.5rem",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <p
                  className="details-type"
                  style={{
                    color: "#f1edd5ff",
                    border: "3px dashed #dbd08fff",
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    backgroundColor: "rgba(94, 94, 94, 0.2)",
                  }}
                >
                  Donation posted on <br /> {selectedDonation.date}
                </p>
                <p
                  className="details-type"
                  style={{
                    color: "#f1edd5ff",
                    border: "3px dashed #dbd08fff",
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    backgroundColor: "rgba(94, 94, 94, 0.2)",
                  }}
                >
                  Deliver within <br /> {selectedDonation.expiry}
                </p>
              </div>
            </div>

            <div className="details-content">
              {/* Pickup Location */}
              <div className="details-section">
                <h3>Pickup Location</h3>
                <MapComponent
                  coordinates={selectedDonation.pickup_coordinates}
                  address={selectedDonation.pickup_address}
                />
              </div>

              {/* Destination Location */}
              <div className="details-section">
                <h3>Destination</h3>
                <MapComponent
                  coordinates={selectedDonation.destination_coordinates}
                  address={selectedDonation.destination_address}
                />
              </div>

              {/* Food Type */}
              <div className="details-section">
                <h3>Food Type</h3>
                <div className="tags-container">
                  <span className="tag">{selectedDonation.smart_tags}</span>
                </div>
              </div>

              {/* Ingredients */}
              {selectedDonation.ingredients && (
                <div className="details-section">
                  <h3>Ingredients</h3>
                  <div className="tags-container">
                    {selectedDonation.ingredients.map((i, idx) => (
                      <span key={idx} className="tag ingredient-tag">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage */}
              <div className="details-section">
                <strong
                  style={{
                    fontFamily: "DM Mono",
                  }}
                >
                  Storage:
                </strong>{" "}
                {selectedDonation.storage}
              </div>

              {/* Expiry */}
              <div className="details-section">
                <strong
                  style={{
                    fontFamily: "DM Mono",
                  }}
                >
                  Shelf Life:
                </strong>{" "}
                {selectedDonation.expiry}
              </div>
            </div>

            <button
              className="accept-details-btn"
              onClick={() => {
                setDetailsView(false);
                setConfirmMessage(true);
              }}
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "large",
              }}
            >
              Accept Pickup
            </button>
          </div>
        </>
      )}

      {confirmMessage && (
        <>
          <div className="overlay-screen" />
          <div
            className="details-modal"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyItems: "center",
              alignItems: "center",
              gap: "1rem",
              height: "fit-content",
              padding: "2rem 1rem",
            }}
          >
            <img
              src={applaud}
              style={{
                width: "25%",
              }}
            />
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "DM Mono",
              }}
            >
              <span
                style={{
                  color: "#e2d7a0",
                  padding: "0.5rem 0 1rem 0",
                }}
              >
                Donation accepted!
                <br />
                Thank you for making a difference. <br />
              </span>

              <span
                style={{
                  letterSpacing: "2px",
                }}
              >
                - Team Naimat
              </span>
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#d8d8d8ff",
                fontFamily: "DM Mono",
                textAlign: "center",
                margin: "0 5rem",
              }}
            >
              Recipient and Donor details have been shared via email.
            </div>

            <button
              className="accept-btn"
              onClick={() => setConfirmMessage(false)}
            >
              Acknowledged!
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Volunteer;
