import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AzureMapViewer from "../components/AzureMapViewer";
import AzureMapPicker from "../components/AzureMapPicker";
import "../styles/Form.css";
import "../styles/receiver.css";
import calendar from "../assets/calendar-days-solid-full.svg";
import pin from "../assets/location-dot-solid-full.svg";
import headerPNG from "../assets/IMG_9076.PNG";
import celebrate from "../assets/wired-outline-1103-confetti-hover-pinch.gif";
import { useUser } from "../context/UserContext";
import TermsCond from "../components/TermsCond";

function Receiver() {
  const { user, checkAuthError } = useUser();
  const [donationsData, setDonationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donations from backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await fetch('naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/available');
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
            quantity: donation.quantity || null,
            donor_id: donation.donor_id,
          };
        });

        const filteredData = transformedData.filter(donation => {
          const isExpired = getTimeRemaining(donation.expiry)?.text === "Expired";
          const isNotCurrentUser = donation.donor_id !== user?.id;
          return !isExpired && isNotCurrentUser;
        });


        setDonationsData(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [locationBased, setLocationBased] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [detailsView, setDetailsView] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showAcceptOptions, setShowAcceptOptions] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
  });
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryLocationConfirmed, setDeliveryLocationConfirmed] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [showSelfPickupForm, setShowSelfPickupForm] = useState(false);
  const [pickupContact, setPickupContact] = useState({
    phone: "",
    email: ""
  });
  const [pickupError, setPickupError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailSending, setShowEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      console.log("Empty search query");
      // Clear search results if query is empty
      setSearchResults(null);
      return;
    }

    try {
      setIsSearching(true);
      console.log("Searching for:", searchQuery);
      
      const response = await fetch('naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          select: ["id", "caption"],
          search_fields: ["caption", "ingredients", "azure_tags", "smart_tags", "allergens", "meal_type"]
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      
      // Store search results
      setSearchResults(data.results || []);
      
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

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

  // Format distance for display
  const formatDistance = (distanceInMeters) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m away`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km away`;
    }
  };

  const filteredDonations = donationsData.filter((d) => {
    // If search results exist, filter by search result IDs
    if (searchResults && searchResults.length > 0) {
      const searchIds = searchResults.map(result => parseInt(result.id));
      if (!searchIds.includes(d.id)) {
        return false;
      }
    }
    
    if (filter === "All") return true;

    // Map display names to actual database values (case-insensitive)
    const categoryMap = {
      "Cooked": "cooked",
      "Packaged": "packaged",
      "Raw/Fresh": "raw"
    };

    const dbValue = categoryMap[filter] || filter.toLowerCase();
    return d.food_category?.toLowerCase() === dbValue;
  });

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (locationBased && userLocation) {
      // Sort by distance (nearest first)
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.coordinates[0],
        a.coordinates[1]
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.coordinates[0],
        b.coordinates[1]
      );
      return distanceA - distanceB;
    } else {
      // Sort by date
      return sort === "Newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    }
  });

  const handleAcceptDonation = (donation) => {
    setSelectedDonation(donation);
    setShowAcceptOptions(true);
  };

  const handleSelfPickup = () => {
    setShowAcceptOptions(false);
    setShowSelfPickupForm(true);
  };

  const handleSubmitSelfPickup = () => {
    // Validate phone and email
    const phoneRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pickupContact.phone || !pickupContact.email) {
      setPickupError("Please provide both phone number and email");
      return;
    }

    if (!phoneRegex.test(pickupContact.phone)) {
      setPickupError("Please enter a valid 11-digit phone number");
      return;
    }

    if (!emailRegex.test(pickupContact.email)) {
      setPickupError("Please enter a valid email address");
      return;
    }

    setPickupError("");
    setShowSelfPickupForm(false);
    setDetailsView(false);
    setShowTerms(true);
  };

  const fetchDonorEmail = async (donationId) => {
    try {
      setShowEmailSending(true);
      setEmailSent(false);

      const token = localStorage.getItem("access_token");

      console.log('Attempting to notify donor for donation:', donationId);
      console.log('Token exists:', !!token);
      console.log('User:', user);
      console.log('Pickup contact:', pickupContact);

      if (!token) {
        console.error('No access token found');
        setShowEmailSending(false);
        alert('Please log in again to continue');
        return;
      }

      // Get recipient name from user context
      const recipientName = user?.name || "Recipient";

      const requestBody = {
        recipientName: recipientName,
        recipientEmail: pickupContact.email,
        recipientContact: pickupContact.phone,
      };

      console.log('Sending request to notify donor:', requestBody);

      // Send email notification to donor
      const response = await fetch(`naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/notify-donor/${donationId}`, {
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

  const handleDelivery = () => {
    setShowAcceptOptions(false);
    setDeliveryLocation(null);
    setDeliveryLocationConfirmed(false);
    setDeliveryError("");
    setShowDeliveryForm(true);
  };

  const handleDeliveryLocationSelect = (locationData) => {
    setDeliveryLocation(locationData);
    setDeliveryLocationConfirmed(false); // Reset confirmation when location changes
    console.log("Delivery Location Selected:", {
      coordinates: locationData.coordinates,
      latitude: locationData.coordinates[1],
      longitude: locationData.coordinates[0],
      address: locationData.address
    });
  };

  const handleConfirmLocation = () => {
    if (!deliveryLocation) {
      setDeliveryError("Please select a delivery location on the map.");
      return;
    }
    setDeliveryLocationConfirmed(true);
    setDeliveryError("");
    console.log("Location Confirmed - Latitude:", deliveryLocation.coordinates[1], "Longitude:", deliveryLocation.coordinates[0]);
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryLocationConfirmed || !deliveryLocation) {
      setDeliveryError("Please confirm your location first.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert('Please log in to continue');
        return;
      }

      const deliveryData = {
        foodpost_id: selectedDonation.id,
        recipient_id: user.id,
        latitude: deliveryLocation.coordinates[1],
        longitude: deliveryLocation.coordinates[0],
      };

      console.log("Creating delivery post with data:", deliveryData);

      const response = await fetch('naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/delivery-post/create', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryData),
      });

      // Check if authentication failed
      if (checkAuthError(response)) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create delivery request');
      }

      const result = await response.json();
      console.log("Delivery post created successfully:", result);

      setDeliveryError("");
      setShowDeliveryForm(false);
      setDetailsView(false);
      setConfirmationMessage(true);
    } catch (error) {
      console.error('Error creating delivery request:', error);
      setDeliveryError('Failed to create delivery request: ' + error.message);
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
        <div className="filter-sort-bar">
          <form onSubmit={handleSearch} className="filter-group" style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.95rem',
                  border: '2px solid #f2e9b9',
                  borderRadius: '8px',
                  backgroundColor: '#2d3748',
                  color: '#f2e9b9',
                  fontFamily: 'DM Mono',
                  outline: 'none',
                  width: '100%',
                  opacity: isSearching ? 0.6 : 1,
                }}
                onFocus={(e) => e.target.style.borderColor = '#e2d7a0'}
                onBlur={(e) => e.target.style.borderColor = '#f2e9b9'}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                padding: '8px 16px',
                fontSize: '0.95rem',
                border: '2px solid #f2e9b9',
                borderRadius: '8px',
                backgroundColor: isSearching ? '#888' : '#f2e9b9',
                color: '#2d3748',
                fontFamily: 'DM Mono',
                fontWeight: 'bold',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isSearching ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isSearching) {
                  e.target.style.backgroundColor = '#e2d7a0';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSearching) {
                  e.target.style.backgroundColor = '#f2e9b9';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {searchResults !== null && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.95rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'DM Mono',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ❌ 
              </button>
            )}
          </form>

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
              <option>Cooked</option>
              <option>Packaged</option>
              <option>Raw/Fresh</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              disabled={locationBased}
              style={{ opacity: locationBased ? 0.5 : 1 }}
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
            {locationBased && (
              <span style={{ fontSize: '0.8rem', color: '#f2e9b9', marginLeft: '8px' }}>
                Sorted by distance
              </span>
            )}
          </div>
        </div>

        {searchResults !== null && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(242, 233, 185, 0.1)',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'DM Mono',
            color: '#f2e9b9',
            fontSize: '1rem',
          }}>
            {filteredDonations.length === 0 ? (
              <span>No results found for "{searchQuery}"</span>
            ) : (
              <span>Showing {filteredDonations.length} result{filteredDonations.length !== 1 ? 's' : ''} for "{searchQuery}"</span>
            )}
          </div>
        )}

        <section className="donations">
          {loading && <div className="loading-message">Loading donations...</div>}
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
                {searchResults !== null && searchResults.length === 0 
                  ? `No donations match your search for "${searchQuery}".`
                  : donationsData.length === 0 
                  ? 'No donations available at the moment.' 
                  : 'No donations to show with current filters.'}
              </div>
            )}
            {sortedDonations.map((donation, index) => (
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
                    {donation.quantity && donation.quantity > 0 && getTimeRemaining(donation.expiry)?.text != "Expired" && (
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

                  {/* Location link */}
                  {donation.coordinates && donation.coordinates.length === 2 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
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

      {/* SELF PICKUP CONTACT FORM */}
      {showSelfPickupForm && (
        <>
          <div
            className="overlay-screen"
            onClick={() => {
              setShowSelfPickupForm(false);
              setPickupError("");
              setPickupContact({ phone: "", email: "" });
            }}
          />
          <div className="details-modal">
            <button
              className="close-details-btn"
              onClick={() => {
                setShowSelfPickupForm(false);
                setPickupError("");
                setPickupContact({ phone: "", email: "" });
              }}
            >
              ✕
            </button>

            <div className="details-header">
              <h2 className="details-caption">Enter Contact Details</h2>
              <p className="details-type">
                Please provide your contact information for coordination
              </p>
            </div>

            <div className="details-content">
              {pickupError && (
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
                  {pickupError}
                </div>
              )}

              <div className="details-section" style={{ marginBottom: "20px" }}>
                <h3>Phone Number</h3>
                <input
                  type="tel"
                  placeholder="Enter 11-digit phone number"
                  value={pickupContact.phone}
                  onChange={(e) => setPickupContact({ ...pickupContact, phone: e.target.value.replace(/\D/g, '') })}
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
                  value={pickupContact.email}
                  onChange={(e) => setPickupContact({ ...pickupContact, email: e.target.value })}
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
              onClick={handleSubmitSelfPickup}
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "large",
                marginTop: "20px",
              }}
            >
              Confirm Pickup
            </button>
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
            onClick={() => {
              setShowDeliveryForm(false);
              setDeliveryLocation(null);
              setDeliveryLocationConfirmed(false);
              setDeliveryError("");
            }}
          />
          <div
            className="details-modal"
            style={{
              zIndex: 5000,
              maxWidth: "700px",
            }}
          >
            <button
              className="close-details-btn"
              onClick={() => {
                setShowDeliveryForm(false);
                setDeliveryLocation(null);
                setDeliveryLocationConfirmed(false);
                setDeliveryError("");
              }}
            >
              ✕
            </button>

            <div className="details-header">
              <h2 className="details-caption">Select Delivery Location</h2>
              <p className="details-type">
                {!deliveryLocationConfirmed 
                  ? "Pin your delivery address on the map" 
                  : "✓ Location confirmed - Ready to create delivery request"}
              </p>
            </div>

            <div className="delivery-form">
              {deliveryError && (
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
                  {deliveryError}
                </div>
              )}

              {!deliveryLocationConfirmed && (
                <div style={{ marginBottom: "20px" }}>
                  <AzureMapPicker 
                    onLocationSelect={handleDeliveryLocationSelect}
                    initialCenter={[67.0011, 24.8607]}
                    initialZoom={11}
                    height="400px"
                  />
                </div>
              )}

              {deliveryLocation && (
                <div style={{
                  padding: "15px",
                  backgroundColor: deliveryLocationConfirmed 
                    ? "rgba(76, 175, 80, 0.15)" 
                    : "rgba(242, 233, 185, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: deliveryLocationConfirmed 
                    ? "2px solid rgba(76, 175, 80, 0.5)" 
                    : "1px solid rgba(242, 233, 185, 0.3)"
                }}>
                  <p style={{
                    color: deliveryLocationConfirmed ? "#4CAF50" : "#f2e9b9",
                    fontSize: "0.9rem",
                    margin: "0 0 8px 0",
                    fontFamily: "DM Mono",
                    fontWeight: "600"
                  }}>
                    {deliveryLocationConfirmed ? "✓ Confirmed Location:" : "Selected Location:"}
                  </p>
                  <p style={{
                    color: "#e2d7a0",
                    fontSize: "0.85rem",
                    margin: "0 0 8px 0",
                    fontFamily: "DM Mono",
                    lineHeight: "1.5"
                  }}>
                    {deliveryLocation.address || `Lat: ${deliveryLocation.coordinates[1].toFixed(6)}, Lon: ${deliveryLocation.coordinates[0].toFixed(6)}`}
                  </p>
                  <p style={{
                    color: "#b8b8b8",
                    fontSize: "0.75rem",
                    margin: 0,
                    fontFamily: "DM Mono",
                  }}>
                    Lat: {deliveryLocation.coordinates[1].toFixed(6)} | Lon: {deliveryLocation.coordinates[0].toFixed(6)}
                  </p>
                </div>
              )}

              {!deliveryLocationConfirmed ? (
                <button
                  className="accept-btn"
                  onClick={handleConfirmLocation}
                  style={{
                    fontSize: "large",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    width: "100%",
                    background: deliveryLocation ? "#FFC107" : "#555",
                    cursor: deliveryLocation ? "pointer" : "not-allowed",
                  }}
                  disabled={!deliveryLocation}
                >
                  Confirm Location
                </button>
              ) : (
                <button
                  className="accept-btn"
                  onClick={handleSubmitDelivery}
                  style={{
                    fontSize: "large",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    width: "100%",
                    background: "#4CAF50",
                  }}
                >
                  Confirm Delivery
                </button>
              )}
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

      {/* TERMS AND CONDITIONS */}
      {showTerms && (
        <TermsCond
          userType="recipient"
          deliveryMode={deliveryMode === "self" ? "self-pickup" : "delivery"}
          onAgree={async () => {
            setShowTerms(false);
            // Fetch and log donor email
            if (selectedDonation && selectedDonation.id) {
              await fetchDonorEmail(selectedDonation.id);
            }
          }}
          onDisagree={() => {
            setShowTerms(false);
            // Reset states when user disagrees
            setPickupContact({ phone: "", email: "" });
            setDeliveryMode("");
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
                <img src={celebrate} style={{
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

export default Receiver;
