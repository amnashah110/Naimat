import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import headerPNG from "../assets/IMG_9076.PNG";
import { useUser } from "../context/UserContext";

function MyDonations() {
  const { user, checkAuthError } = useUser();
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Fetch user's donations from backend
  useEffect(() => {
    const fetchMyDonations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/donation/available');
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        const data = await response.json();

        // Filter only donations posted by current user
        const myDonations = data.filter(donation => donation.donor_id === user.id);

        // Transform backend data to match frontend structure
        const transformedData = myDonations.map(donation => {
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
            coordinates: [donation.latitude || 24.8607, donation.longitude || 67.0011],
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
            quantity: donation.quantity || null,
            donor_id: donation.donor_id,
          };
        });

        const toRemove = transformedData.filter(donation => getTimeRemaining(donation.expiry)?.text === "Expired");
        const filteredData = transformedData.filter(donation => !toRemove.includes(donation));
        setDonationsData(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [user]);

  // Calculate time remaining until expiry
  const getTimeRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return { text: "Expired", color: "#ff6b6b" };
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    let text, color;
    
    if (diffDays > 0) {
      text = `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
      color = diffDays > 7 ? "#4CAF50" : diffDays > 3 ? "#FFC107" : "#FF9800";
    } else if (diffHours > 0) {
      text = `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
      color = diffHours > 12 ? "#FFC107" : "#FF9800";
    } else if (diffMinutes > 0) {
      text = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} left`;
      color = "#ff6b6b";
    } else {
      text = "Expiring soon";
      color = "#ff6b6b";
    }
    
    return { text, color };
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/donation/${donationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Check if authentication failed
      if (checkAuthError(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete donation");
      }

      // Remove from local state
      setDonationsData(donationsData.filter(d => d.id !== donationId));
      alert("Donation deleted successfully");
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert("Failed to delete donation: " + error.message);
    }
  };

  const handleMarkAsDelivered = async (donationId) => {
    if (!window.confirm("Mark this donation as delivered? This will remove it from your active donations and count it as a successful delivery.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:3000/donation/mark-delivered/${donationId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Check if authentication failed
      if (checkAuthError(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to mark donation as delivered");
      }

      // Remove from local state
      setDonationsData(donationsData.filter(d => d.id !== donationId));
      alert("Donation marked as delivered successfully! 🎉");
    } catch (error) {
      console.error("Error marking donation as delivered:", error);
      alert("Failed to mark donation as delivered: " + error.message);
    }
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
        <div className="form-header">
          <div className="form-title">
            My Donations
          </div>
        </div>

        <section className="donations">
          {loading && <div className="loading-message">Loading your donations...</div>}
          {error && <div className="error-message">Error: {error}</div>}
          <div className="donation-list">
            {!loading && !error && donationsData.length === 0 && (
              <div className="no-donations-message" style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#f2e9b9',
                fontSize: '1.2rem',
                fontFamily: 'DM Mono'
              }}>
                You haven't posted any donations yet.
              </div>
            )}
            {donationsData.map((donation, index) => (
              <div
                key={donation.id}
                className="donation-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {donation.picture_url && (
                  <div style={{ position: 'relative' }}>
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
                    {donation.quantity && donation.quantity > 0 && getTimeRemaining(donation.expiry)?.text !== "Expired" && (
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
                        <span>{donation.quantity} Available</span>
                      </div>
                    )}
                    {donation.expiry && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: getTimeRemaining(donation.expiry)?.color || "#f2e9b9",
                          border: `2px solid ${getTimeRemaining(donation.expiry)?.color || "#f2e9b9"}`,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <span>{getTimeRemaining(donation.expiry)?.text || ""}</span>
                      </div>
                    )}
                  </div>
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

                  {/* Location link */}
                  {donation.coordinates && donation.coordinates.length === 2 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <img
                        src={pin}
                        style={{
                          width: "6%",
                        }}
                        alt="Location pin"
                      />
                      <a 
                        href={`https://www.google.com/maps?q=${donation.coordinates[0]},${donation.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#87CEEB",
                          textDecoration: "none",
                          fontWeight: "500",
                          fontSize: "0.95rem",
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                        onMouseOut={(e) => e.target.style.textDecoration = "none"}
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>

                <div className="donation-actions">
                  <button 
                    className="details-btn" 
                    onClick={() => handleDeleteDonation(donation.id)}
                    style={{
                      backgroundColor: "#b60909ff",
                      color: "white",
                      border: "2px solid #ff6b6b",
                    }}
                  >
                    Delete Donation
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
                <button 
                    className="accept-btn" 
                    onClick={() => handleMarkAsDelivered(donation.id)}
                    style={{
                      background: "#067a0aff !important",
                      color: "white",
                      border: "2px solid #86d18aff",
                      width: "100%",
                      marginTop: "8px",
                    }}
                  >
                    Mark as Delivered
                  </button>
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

                {selectedDonation.expiry && (
                  <div className="detail-item">
                    <span className="detail-label">⏰ Time Left:</span>
                    <span 
                      className="detail-value" 
                      style={{ 
                        color: getTimeRemaining(selectedDonation.expiry)?.color || "#f2e9b9",
                        fontWeight: "bold"
                      }}
                    >
                      {getTimeRemaining(selectedDonation.expiry)?.text || ""}
                    </span>
                  </div>
                )}
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

              {/* Location */}
              {selectedDonation.coordinates && selectedDonation.coordinates.length === 2 && (
                <div className="details-section">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">
                      <a 
                        href={`https://www.google.com/maps?q=${selectedDonation.coordinates[0]},${selectedDonation.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#87CEEB",
                          textDecoration: "none",
                          fontWeight: "500"
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                        onMouseOut={(e) => e.target.style.textDecoration = "none"}
                      >
                        View on Google Maps
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              className="accept-details-btn"
              onClick={() => setDetailsView(false)}
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "large",
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MyDonations;
