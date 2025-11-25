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
import TermsCond from "../components/TermsCond";

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
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [volunteerContact, setVolunteerContact] = useState({
    phone: "",
    email: ""
  });
  const [volunteerError, setVolunteerError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailSending, setShowEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Fetch delivery posts from backend
  useEffect(() => {
    const fetchDeliveryPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/delivery-post/all');
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

  const handleVolunteerClick = (donation) => {
    setSelectedDonation(donation);
    setShowVolunteerForm(true);
  };

  const handleSubmitVolunteer = () => {
    // Validate phone and email
    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!volunteerContact.phone || !volunteerContact.email) {
      setVolunteerError("Please provide both phone number and email");
      return;
    }

    if (!phoneRegex.test(volunteerContact.phone)) {
      setVolunteerError("Please enter a valid 11-digit phone number");
      return;
    }

    if (!emailRegex.test(volunteerContact.email)) {
      setVolunteerError("Please enter a valid email address");
      return;
    }

    setVolunteerError("");
    setShowVolunteerForm(false);
    setShowTerms(true);
  };

  const notifyDonorAboutVolunteer = async (deliveryPostId) => {
    try {
      setShowEmailSending(true);
      setEmailSent(false);

      const token = localStorage.getItem("access_token");

      console.log('Attempting to notify donor about volunteer for delivery post:', deliveryPostId);
      console.log('Token exists:', !!token);
      console.log('User:', user);
      console.log('Volunteer contact:', volunteerContact);

      if (!token) {
        console.error('No access token found');
        setShowEmailSending(false);
        alert('Please log in again to continue');
        return;
      }

      // Get volunteer name from user context
      const volunteerName = user?.name || "Volunteer";

      const requestBody = {
        volunteerName: volunteerName,
        volunteerEmail: volunteerContact.email,
        volunteerContact: volunteerContact.phone,
      };

      console.log('Sending request to notify donor:', requestBody);

      // Send email notification to donor
      const response = await fetch(`https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/delivery-post/notify-donor/${deliveryPostId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      // Check if authentication failed
      if (checkAuthError(response)) {
        setShowEmailSending(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        setShowEmailSending(false);
        throw new Error(errorData.message || 'Failed to notify donor');
      }

      const result = await response.json();
      console.log('Donor notified successfully:', result);

      // Show success state
      setEmailSent(true);

    } catch (error) {
      console.error('Error notifying donor:', error);
      setShowEmailSending(false);
      alert('Failed to notify donor: ' + error.message);
    }
  };

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
                >
                  <button 
                    className="accept-btn"
                    onClick={() => handleVolunteerClick(d)}
                  >
                    Volunteer
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

      {/* TERMS AND CONDITIONS */}
      {showTerms && (
        <TermsCond
          userType="volunteer"
          deliveryMode="delivery"
          onAgree={async () => {
            setShowTerms(false);
            // Notify donor about volunteer
            if (selectedDonation && selectedDonation.deliverypost_id) {
              await notifyDonorAboutVolunteer(selectedDonation.deliverypost_id);
            }
          }}
          onDisagree={() => {
            setShowTerms(false);
            // Reset states when user disagrees
            setVolunteerContact({ phone: "", email: "" });
          }}
        />
      )}

      {/* VOLUNTEER CONTACT FORM */}
      {showVolunteerForm && (
        <>
          <div
            className="overlay-screen"
            onClick={() => {
              setShowVolunteerForm(false);
              setVolunteerError("");
              setVolunteerContact({ phone: "", email: "" });
            }}
          />
          <div className="details-modal">
            <button
              className="close-details-btn"
              onClick={() => {
                setShowVolunteerForm(false);
                setVolunteerError("");
                setVolunteerContact({ phone: "", email: "" });
              }}
            >
              ✕
            </button>

            <div className="details-header">
              <h2 className="details-caption">Enter Your Contact Details</h2>
              <p className="details-type">
                Please provide your contact information so we can coordinate the delivery
              </p>
            </div>

            <div className="details-content">
              {volunteerError && (
                <div
                  className="error-message"
                  style={{
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    padding: "10px",
                    backgroundColor: "rgba(255, 107, 107, 0.1)",
                    borderRadius: "8px",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {volunteerError}
                </div>
              )}

              <div className="details-section" style={{ marginBottom: "20px" }}>
                <h3>Phone Number</h3>
                <input
                  type="tel"
                  placeholder="Enter 11-digit phone number"
                  value={volunteerContact.phone}
                  onChange={(e) => setVolunteerContact({ ...volunteerContact, phone: e.target.value.replace(/\D/g, '') })}
                  maxLength="11"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "1rem",
                    border: "2px solid #f2e9b9",
                    borderRadius: "8px",
                    backgroundColor: "#2d3748",
                    color: "#f2e9b9",
                    fontFamily: "DM Mono",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#e2d7a0"}
                  onBlur={(e) => e.target.style.borderColor = "#f2e9b9"}
                />
              </div>

              <div className="details-section">
                <h3>Email Address</h3>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={volunteerContact.email}
                  onChange={(e) => setVolunteerContact({ ...volunteerContact, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "1rem",
                    border: "2px solid #f2e9b9",
                    borderRadius: "8px",
                    backgroundColor: "#2d3748",
                    color: "#f2e9b9",
                    fontFamily: "DM Mono",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#e2d7a0"}
                  onBlur={(e) => e.target.style.borderColor = "#f2e9b9"}
                />
              </div>
            </div>

            <button
              className="accept-details-btn"
              onClick={handleSubmitVolunteer}
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "large",
                marginTop: "20px",
              }}
            >
              Confirm Volunteering
            </button>
          </div>
        </>
      )}

      {/* TERMS AND CONDITIONS */}
      {showTerms && (
        <TermsCond
          userType="volunteer"
          deliveryMode="delivery"
          onAgree={async () => {
            setShowTerms(false);
            // Notify donor about volunteer
            if (selectedDonation && selectedDonation.deliverypost_id) {
              await notifyDonorAboutVolunteer(selectedDonation.deliverypost_id);
            }
          }}
          onDisagree={() => {
            setShowTerms(false);
            // Reset states when user disagrees
            setVolunteerContact({ phone: "", email: "" });
          }}
        />
      )}

      {/* EMAIL SENDING POPUP */}
      {showEmailSending && (
        <>
          <div className="overlay-screen" />
          <div className="details-modal" style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            gap: "1.5rem",
            height: "fit-content",
            padding: "2rem 1rem",
          }}>
            {!emailSent ? (
              <>
                {/* Loading state */}
                <div style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid rgba(242, 233, 185, 0.3)",
                  borderTop: "4px solid #f2e9b9",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <div style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "DM Mono",
                  color: "#f2e9b9",
                }}>
                  Sending your details to donor...
                </div>
                <div style={{
                  fontSize: "0.95rem",
                  textAlign: "center",
                  fontFamily: "DM Mono",
                  color: "#e2d7a0",
                  opacity: 0.8,
                }}>
                  Please wait a moment
                </div>
              </>
            ) : (
              <>
                {/* Success state */}
                <img src={applaud} style={{
                  width: "25%",
                }} alt="Success" />
                <div style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "DM Mono",
                  color: "#f2e9b9",
                }}>
                  Email sent to donor!
                </div>
                <div style={{
                  fontSize: "0.95rem",
                  textAlign: "center",
                  fontFamily: "DM Mono",
                  color: "#e2d7a0",
                  lineHeight: "1.6",
                  padding: "0 1rem",
                }}>
                  Please wait till they reach out to you for coordination.
                </div>
                <button
                  className="accept-btn"
                  onClick={() => {
                    setShowEmailSending(false);
                    setEmailSent(false);
                    setConfirmMessage(true);
                  }}
                  style={{
                    fontSize: "large",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Got it!
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Volunteer;
