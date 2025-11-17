import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import headerPNG from "../assets/IMG_9076.PNG";

function Receiver() {
  const donationsData = [
    {
      id: 1,
      type: "Food",
      date: "2025-11-10",
      address: "Gulshan-e-Iqbal, Karachi",
      coordinates: [24.8515, 67.0738],
      caption: "Fresh Homemade Biryani",
      smart_tags: "non-veg",
      ingredients: ["Basmati Rice", "Chicken", "Onions", "Yogurt", "Spices"],
      azure_tags: ["Indian", "Rice-based", "Non-vegetarian", "Aromatic", "Cooked", "Dinner", "Restaurant-quality", "Spiced", "Fragrant", "Meal"],
      storage: "refrigerated",
      expiry: "2-3 days",
      allergens: ["Sesame", "Celery"],
      meal_type: "dinner",
      food_category: "cooked"
    },
    {
      id: 2,
      type: "Food",
      date: "2025-11-08",
      address: "Model Town, Lahore",
      coordinates: [31.5497, 74.3436],
      caption: "Packaged Organic Cereal Boxes",
      smart_tags: "vegetarian",
      ingredients: ["Oats", "Honey", "Almonds", "Raisins"],
      azure_tags: ["Breakfast", "Organic", "Packaged", "Vegetarian", "Healthy", "Nutritious", "Convenient", "Shelf-stable", "Whole Grain", "Energy"],
      storage: "room temperature",
      expiry: "6 months",
      allergens: ["Tree Nuts", "Gluten"],
      meal_type: "breakfast",
      food_category: "packaged"
    },
    {
      id: 3,
      type: "Food",
      date: "2025-11-12",
      address: "University Road, Peshawar",
      coordinates: [34.1526, 71.5769],
      caption: "Fresh Vegetables Bundle",
      smart_tags: "vegetarian",
      ingredients: ["Tomatoes", "Cucumbers", "Bell Peppers", "Green Beans", "Carrots"],
      azure_tags: ["Vegetables", "Fresh", "Raw", "Organic", "Vegetarian", "Healthy", "Natural", "Farmers Market", "Seasonal", "Crispy"],
      storage: "room temperature",
      expiry: "5-7 days",
      allergens: "None",
      meal_type: "snack",
      food_category: "fresh_raw"
    },
    {
      id: 4,
      type: "Food",
      date: "2025-11-09",
      address: "Saddar, Rawalpindi",
      coordinates: [33.5731, 73.1898],
      caption: "Homemade Chicken Karahi",
      smart_tags: "non-veg",
      ingredients: ["Chicken", "Tomatoes", "Ginger", "Garlic", "Green Peppers", "Spices"],
      azure_tags: ["Pakistani", "Non-vegetarian", "Cooked", "Spiced", "Authentic", "Aromatic", "Traditional", "Dinner", "Savory", "Meal"],
      storage: "refrigerated",
      expiry: "1-2 days",
      allergens: ["Garlic"],
      meal_type: "dinner",
      food_category: "cooked"
    },
    {
      id: 5,
      type: "Food",
      date: "2025-11-07",
      address: "Defence, Karachi",
      coordinates: [24.7898, 67.0756],
      caption: "Fresh Mixed Fruits Collection",
      smart_tags: "vegetarian",
      ingredients: ["Apples", "Bananas", "Oranges", "Mangoes", "Strawberries"],
      azure_tags: ["Fruits", "Fresh", "Raw", "Vegetarian", "Healthy", "Nutritious", "Natural", "Vitamins", "Organic", "Seasonal"],
      storage: "room temperature",
      expiry: "4-6 days",
      allergens: "None",
      meal_type: "snack",
      food_category: "fresh_raw"
    },
    {
      id: 6,
      type: "Food",
      date: "2025-11-11",
      address: "Cantt, Lahore",
      coordinates: [31.5204, 74.3587],
      caption: "Packaged Biscuits & Cookies Assortment",
      smart_tags: "vegetarian",
      ingredients: ["Wheat Flour", "Sugar", "Butter", "Vanilla Extract", "Baking Soda"],
      azure_tags: ["Biscuits", "Packaged", "Vegetarian", "Breakfast", "Snack", "Sweet", "Convenient", "Long-shelf-life", "Bakery", "Treats"],
      storage: "room temperature",
      expiry: "8 months",
      allergens: ["Wheat", "Dairy", "Eggs"],
      meal_type: "snack",
      food_category: "packaged"
    },
  ];

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const filteredDonations = donationsData.filter(
    (d) => filter === "All" || d.food_category === filter
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    return sort === "Newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="form" style={{
      paddingTop: "80px",
    }}>
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />
      
      <div className="donations-body">
        <div className="filter-sort-bar">
          <div className="location-toggle-container">
            <label>Location-based</label>
            <button 
              className={`location-toggle ${locationBased ? 'active' : ''}`}
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
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <img src={calendar} style={{
                        width: "6%",
                      }}/>
                      <div className="donation-date">
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <img src={pin} style={{
                        width: "6%",
                      }}/>
                      <div className="donation-address">{donation.address}</div>
                    </div>
                  </div>

                  <div className="donation-actions">
                    <button className="accept-btn">Accept Donation</button>
                    <button className="details-btn" 
                    onClick={()=> {
                      setSelectedDonation(donation);
                      setDetailsView(true);
                    }}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {detailsView && selectedDonation && (
        <>
        <div className="overlay-screen" onClick={()=> setDetailsView(false)}/>
        <div className="details-modal">
          <button className="close-details-btn" onClick={() => setDetailsView(false)}>✕</button>
          
          <div className="details-header">
            <h2 className="details-caption">{selectedDonation.caption}</h2>
            <p className="details-type">{selectedDonation.type}</p>
          </div>

          <div className="details-content">
            {/* Address & Date with Map */}
            <div className="details-section">
              <h3>Pickup Location</h3>
              {selectedDonation.coordinates && (
                <MapComponent 
                  coordinates={selectedDonation.coordinates} 
                  address={selectedDonation.address}
                />
              )}
              <div className="detail-item" style={{ marginTop: "1rem" }}>
                <span className="detail-label">📍 Address:</span>
                <span className="detail-value">{selectedDonation.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Date:</span>
                <span className="detail-value">{new Date(selectedDonation.date).toLocaleDateString()}</span>
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

            {/* Ingredients */}
            {selectedDonation.ingredients && selectedDonation.ingredients.length > 0 && (
              <div className="details-section">
                <h3>Ingredients</h3>
                <div className="tags-container">
                  {selectedDonation.ingredients.map((ingredient, idx) => (
                    <span key={idx} className="tag ingredient-tag">{ingredient}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Type */}
            <div className="details-section">
              <h3>Meal Type</h3>
              <div className="tags-container">
                <span className="tag meal-tag">{selectedDonation.meal_type}</span>
              </div>
            </div>

            {/* Storage & Expiry */}
            <div className="details-section">
              <div className="detail-item">
                <span className="detail-label">Storage:</span>
                <span className="detail-value">{selectedDonation.storage}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Shelf Life:</span>
                <span className="detail-value">{selectedDonation.expiry}</span>
              </div>
            </div>

            {/* Allergens */}
            {selectedDonation.allergens && selectedDonation.allergens !== "None" && (
              <div className="details-section allergen-warning">
                <h3>Allergens</h3>
                <div className="tags-container">
                  {Array.isArray(selectedDonation.allergens) ? (
                    selectedDonation.allergens.map((allergen, idx) => (
                      <span key={idx} className="tag allergen-tag">{allergen}</span>
                    ))
                  ) : (
                    <span className="detail-value">{selectedDonation.allergens}</span>
                  )}
                </div>
              </div>
            )}

            {/* Azure Tags */}
            {selectedDonation.azure_tags && selectedDonation.azure_tags.length > 0 && (
              <div className="details-section">
                <h3>Tags</h3>
                <div className="tags-container">
                  {selectedDonation.azure_tags.map((tag, idx) => (
                    <span key={idx} className="tag azure-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="accept-details-btn" onClick={() => setDetailsView(false)}>Accept Donation</button>
        </div>
        </>
      )}
    </div>
  );
}


export default Receiver;
