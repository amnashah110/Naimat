import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import applaud from "../assets/wired-outline-1092-applause-hover-pinch.gif";
import headerPNG from "../assets/IMG_9076.PNG";
import { useUser } from "../context/UserContext";

function Volunteer() {
  const { user, checkAuthError } = useUser();
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(false);

  // Fetch delivery posts from backend
  useEffect(() => {
    const fetchDeliveryPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/delivery-post/all');
        if (!response.ok) {
          throw new Error('Failed to fetch delivery posts');
        }
        const data = await response.json();

        // Transform backend data to match frontend structure
        const transformedData = data.map(delivery => {
          const foodpost = delivery.foodpost;
          let llmData = {};
          try {
            llmData = foodpost.llm_response ? JSON.parse(foodpost.llm_response) : {};
          } catch (e) {
            console.error('Error parsing LLM response:', e);
          }

          return {
            id: delivery.id,
            deliverypost_id: delivery.id,
            foodpost_id: foodpost.id,
            type: "Food",
            date: foodpost.posting_date ? new Date(foodpost.posting_date).toISOString().split('T')[0] : "",
            pickup_address: `Lat: ${foodpost.latitude?.toFixed(4)}, Lon: ${foodpost.longitude?.toFixed(4)}`,
            pickup_coordinates: [foodpost.latitude || 24.8607, foodpost.longitude || 67.0011],
            destination_address: delivery.latitude && delivery.longitude 
              ? `Lat: ${delivery.latitude?.toFixed(4)}, Lon: ${delivery.longitude?.toFixed(4)}`
              : "Destination not set",
            destination_coordinates: [delivery.latitude || 24.8607, delivery.longitude || 67.0011],
            caption: llmData.category?.caption || foodpost.description || "No description",
            smart_tags: llmData.category?.smart_tags?.[0] || "veg",
            ingredients: llmData.category?.ingredients || [],
            azure_tags: llmData.category?.azure_tags || [],
            storage: llmData.category?.storage || "room temperature",
            expiry: llmData.expiry?.expiry_date || llmData.category?.expiry || "Not specified",
            allergens: llmData.category?.allergens || [],
            meal_type: llmData.category?.meal_type?.[0] || "any",
            food_category: foodpost.category || "cooked",
            picture_url: llmData.image_url || foodpost.picture_url,
            quantity: foodpost.quantity || null,
          };
        });

        console.log("Transformed delivery data:", transformedData);
        setDonationsData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching delivery posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPosts();
  }, []);

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
          {loading && <div className="loading-message">Loading delivery requests...</div>}
          {error && <div className="error-message">Error: {error}</div>}
          <div className="donation-list">
            {!loading && !error && sortedDonations.length === 0 && (
              <div className="no-donations-message" style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#f2e9b9',
                fontSize: '1.2rem',
                fontFamily: 'DM Mono'
              }}>
                No delivery requests available at the moment.
              </div>
            )}
            {sortedDonations.map((d, index) => (
              <div
                key={d.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {d.picture_url && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={d.picture_url}
                      alt={d.caption}
                      className="donation-image"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                        marginBottom: "1rem"
                      }}
                    />
                    {d.quantity && d.quantity > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: '#f2e9b9',
                          border: '2px solid #f2e9b9',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <span>{d.quantity} Available</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="donation-info">
                  <h3 className="donation-type">{d.caption}</h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <img src={calendar} style={{ width: "6%" }} alt="Calendar icon" />
                    <div className="donation-date">
                      {d.date
                        ? new Date(d.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </div>
                  </div>

                  {/* Pickup Location (from foodpost) */}
                  {d.pickup_coordinates && d.pickup_coordinates.length === 2 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <img src={pin} style={{ width: "6%" }} alt="Location pin" />
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <strong style={{ fontSize: "0.85rem", color: "#f2e9b9" }}>Pickup:</strong>
                        <a
                          href={`https://www.google.com/maps?q=${d.pickup_coordinates[0]},${d.pickup_coordinates[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#87CEEB",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                          }}
                          onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                          onMouseOut={(e) => e.target.style.textDecoration = "none"}
                        >
                          View Donor Location
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Destination Location (from delivery_post) */}
                  {d.destination_coordinates && d.destination_coordinates.length === 2 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <img src={pin} style={{ width: "6%" }} alt="Location pin" />
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <strong style={{ fontSize: "0.85rem", color: "#f2e9b9" }}>Drop-off:</strong>
                        <a
                          href={`https://www.google.com/maps?q=${d.destination_coordinates[0]},${d.destination_coordinates[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#87CEEB",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                          }}
                          onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                          onMouseOut={(e) => e.target.style.textDecoration = "none"}
                        >
                          View Delivery Location
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="donation-actions"
                  onClick={() => {
                    setDetailsView(false);
                    setConfirmMessage(true);
                  }}
                >
                  <button className="accept-btn">Volunteer</button>
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
