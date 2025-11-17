import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AzureMapViewer from "../components/AzureMapViewer";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import headerPNG from "../assets/IMG_9076.PNG";
import celebrate from "../assets/wired-outline-1103-confetti-hover-pinch.gif";

function Receiver() {
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donations from backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/available');
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        const data = await response.json();

        // Transform backend data to match frontend structure
        const transformedData = data.map(donation => {
          let llmData = {};
          try {
            llmData = donation.llm_response ? JSON.parse(donation.llm_response) : {};
          } catch (e) {
            console.error('Error parsing LLM response:', e);
          }

          return {
            id: donation.id,
            type: "Food",
            date: donation.posting_date ? new Date(donation.posting_date).toISOString().split('T')[0] : "",
            coordinates: [donation.latitude || 24.8607, donation.longitude || 67.0011], // Default to Karachi
            caption: llmData.category?.caption || donation.description || "No description",
            smart_tags: llmData.category?.smart_tags?.[0] || "veg",
            ingredients: llmData.category?.ingredients || [],
            azure_tags: llmData.category?.azure_tags || [],
            storage: llmData.category?.storage || "room temperature",
            expiry: llmData.expiry?.expiry_date || llmData.category?.expiry || "Not specified",
            allergens: llmData.category?.allergens || [],
            meal_type: llmData.category?.meal_type?.[0] || "any",
            food_category: donation.category || "cooked",
            picture_url: donation.picture_url,
            contact_details: donation.contact_details,
            special_instructions: donation.special_instructions,
          };
        });

        setDonationsData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
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
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  // Fetch user's current location when location-based toggle is enabled
  useEffect(() => {
    if (locationBased && !userLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocationError(null);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationError("Unable to get your location");
            setLocationBased(false); // Turn off toggle if location fails
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser");
        setLocationBased(false);
      }
    }
  }, [locationBased, userLocation]);

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Format distance for display
  const formatDistance = (distanceInMeters) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m away`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km away`;
    }
  };

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
    setConfirmationMessage(true);
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
              onClick={() => {
                const newState = !locationBased;
                setLocationBased(newState);
                if (!newState) {
                  // Clear user location when toggling off
                  setUserLocation(null);
                  setLocationError(null);
                }
              }}
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
              <option>raw</option>
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
          {loading && <div className="loading-message">Loading donations...</div>}
          {error && <div className="error-message">Error: {error}</div>}
          {!loading && !error && sortedDonations.length === 0 && (
            <div className="no-donations-message">No donations available at the moment.</div>
          )}
          <div className="donation-list">
            {sortedDonations.map((donation, index) => (
              <div
                key={donation.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {donation.picture_url && (
                  <img
                    src={donation.picture_url}
                    alt={donation.caption}
                    className="donation-image"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                      marginBottom: "1rem"
                    }}
                  />
                )}
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
                      alt="Calendar icon"
                    />
                    <div className="donation-date">
  {donation.date
    ? new Date(donation.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""}
</div>

                  </div>

                  {locationBased && userLocation && (
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
                        alt="Location pin"
                      />
                      <div className="donation-address">
                        {formatDistance(
                          calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            donation.coordinates[0],
                            donation.coordinates[1]
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="donation-actions">
                  <button className="accept-btn" onClick={() => handleAcceptDonation(donation)}>
                    Accept Donation
                  </button>
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
  Posted On: {selectedDonation.date
    ? new Date(selectedDonation.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""}
</p>

            </div>

            {selectedDonation.picture_url && (
              <img
                src={selectedDonation.picture_url}
                alt={selectedDonation.caption}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}
              />
            )}

            <div className="details-content">             

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
                    {selectedDonation.storage
                      ? selectedDonation.storage.charAt(0).toUpperCase() + selectedDonation.storage.slice(1).toLowerCase()
                      : ""}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Best Before:</span>
                  <span className="detail-value">
                    {selectedDonation.expiry
                      ? new Date(selectedDonation.expiry).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : ""}
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
                selectedDonation.allergens.length > 0 && (
                  <div className="details-section allergen-warning">
                    <h3>Allergens</h3>
                    <div className="tags-container">
                      {selectedDonation.allergens.map((allergen, idx) => (
                        <span key={idx} className="tag allergen-tag">
                          {allergen ? allergen : "None"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                onClick={() => {
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
                onClick={() => {
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
            }} alt="Celebration" />
            <div style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "DM Mono",
            }}>
              <span style={{
                color: "#e2d7a0",
                padding: "0.5rem 0 1rem 0"
              }}>Donation accepted! </span> <br />
              <span style={{
                letterSpacing: "2px",
              }}>- Team Naimat</span>
            </div>

            <button className="accept-btn"
              onClick={() => setConfirmationMessage(false)}>Acknowledged!</button>
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
