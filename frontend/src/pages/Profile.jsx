import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";
import headerPNG from "../assets/IMG_9076.PNG";
import { useUser } from "../context/UserContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Profile() {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData(user);
      fetchDonationStats();
    }
  }, [user]);

  const fetchDonationStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      console.log("Fetching donation stats...");

      const response = await fetch("naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/donation/user/stats", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Stats fetch error:", errorData);
        throw new Error(errorData.message || "Failed to fetch stats");
      }

      const data = await response.json();
      console.log("Donation stats received:", data);
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform stats data for charts
  const getDonationsData = () => {
    if (!stats || !stats.monthlyData) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      donations: stats.monthlyData[month] || 0,
    }));
  };

  const getDonationTypeData = () => {
    if (!stats || !stats.categoryStats) return [];
    
    const colors = {
      cooked: "#e2d7a0",
      packaged: "#90dd90",
      raw: "#d490ff",
    };

    return Object.entries(stats.categoryStats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[name] || "#b8a878",
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && value !== user.email) {
      setEmailVerificationRequired(true);
    }
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveChanges = () => {
    setUser(editData);
    setIsEditing(false);
    setEmailVerificationRequired(false);
    setOtpSent(false);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setEmailVerificationRequired(false);
    setOtpSent(false);
  };

  const handleSendOTP = () => {
    setOtpSent(true);
    // In a real app, this would call an API to send OTP
  };

  if (userLoading || loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <p style={{ textAlign: 'center', padding: '50px', color: '#e2d7a0' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <p style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}>{error || "Please login to view profile"}</p>
        </div>
      </div>
    );
  }

  const donationsData = getDonationsData();
  const donationTypeData = getDonationTypeData();

  return (
    <div className="profile-container">
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />
      <div className="profile-content">
        {/* Profile Header Section */}
        <section className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name || 'User'}</h1>
            <p className="profile-username">{user.email}</p>
          </div>
        </section>

        {/* Edit Profile Section */}
        <section className="edit-profile-section">
          <div className="section-header">
            <h2>Profile Details</h2>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name || ''}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email ID</label>
                <div className="email-input-group">
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleEditChange}
                    placeholder="Enter email"
                  />
                  {emailVerificationRequired && (
                    <span className="verification-badge">
                      Re-verification required
                    </span>
                  )}
                </div>
              </div>

              {emailVerificationRequired && !otpSent && (
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOTP}
                >
                  Send OTP to verify new email
                </button>
              )}

              {otpSent && (
                <div className="otp-section">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    className="otp-input"
                  />
                  <button type="button" className="verify-otp-btn">
                    Verify OTP
                  </button>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
  <span className="detail-label">Member Since:</span>
  <span className="detail-value">
    {user.timestamp
      ? new Date(user.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : ""}
  </span>
</div>

            </div>
          )}
        </section>

        {/* Data Visualization Section */}
        <section className="data-visualization-section">
          <h2>Your Impact</h2>

          {/* Line Chart - Donations Over Time */}
          <div className="chart-container">
            <h3>Donations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(226, 215, 160, 0.2)"
                />
                <XAxis dataKey="month" stroke="#b8a878" />
                <YAxis stroke="#b8a878" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #e2d7a0",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2d7a0" }}
                />
                <Legend wrapperStyle={{ color: "#f2e9b9" }} />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="#e2d7a0"
                  strokeWidth={3}
                  name="Donations"
                  dot={{ fill: "#e2d7a0", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Monthly Comparison */}
          <div className="chart-container">
            <h3>Monthly Donations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(226, 215, 160, 0.2)"
                />
                <XAxis dataKey="month" stroke="#b8a878" />
                <YAxis stroke="#b8a878" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #e2d7a0",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2d7a0" }}
                />
                <Legend wrapperStyle={{ color: "#f2e9b9" }} />
                <Bar dataKey="donations" fill="#e2d7a0" name="Donations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Donation Types */}
          <div className="chart-container">
            <h3>Donation Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#e2d7a0"
                  dataKey="value"
                >
                  {donationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats?.totalDonations || 0}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats?.activeDonations || 0}</div>
              <div className="stat-label">Active Donations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats?.completedDonations || 0}</div>
              <div className="stat-label">Completed Donations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {stats?.categoryStats ? Object.values(stats.categoryStats).reduce((a, b) => a + b, 0) : 0}
              </div>
              <div className="stat-label">Total Items</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
