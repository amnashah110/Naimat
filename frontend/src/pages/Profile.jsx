import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";
import headerPNG from "../assets/IMG_9076.PNG";
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
  const [user, setUser] = useState({
    fullName: "Ahmed Hassan",
    username: "ahmed_hassan_99",
    email: "ahmed.hassan@email.com",
    phone: "03001234567",
    city: "Karachi",
    age: 28,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Data for charts
  const donationsData = [
    { month: "Jan", donations: 4, meals: 6, volunteered: 3 },
    { month: "Feb", donations: 5, meals: 8, volunteered: 4 },
    { month: "Mar", donations: 7, meals: 10, volunteered: 5 },
    { month: "Apr", donations: 6, meals: 9, volunteered: 4 },
    { month: "May", donations: 8, meals: 12, volunteered: 6 },
    { month: "Jun", donations: 9, meals: 14, volunteered: 7 },
  ];

  const donationTypeData = [
    { name: "Cooked", value: 35, color: "#e2d7a0" },
    { name: "Packaged", value: 28, color: "#90dd90" },
    { name: "Fresh Raw", value: 37, color: "#d490ff" },
  ];

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

  return (
    <div className="profile-container">
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />
      <div className="profile-content">
        {/* Profile Header Section */}
        <section className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">{user.fullName.charAt(0)}</div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.fullName}</h1>
            <p className="profile-username">@{user.username}</p>
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
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleEditChange}
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Email ID</label>
                <div className="email-input-group">
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
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

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={editData.city}
                    onChange={handleEditChange}
                    placeholder="Enter city"
                  />
                </div>
              </div>

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
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">City:</span>
                <span className="detail-value">{user.city}</span>
              </div>
            </div>
          )}
        </section>

        {/* Data Visualization Section */}
        <section className="data-visualization-section">
          <h2>Your Impact</h2>

          {/* Line Chart - Donations Over Time */}
          <div className="chart-container">
            <h3>Donations & Impact Trend</h3>
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
                  strokeWidth={2}
                  name="Donations"
                  dot={{ fill: "#e2d7a0" }}
                />
                <Line
                  type="monotone"
                  dataKey="meals"
                  stroke="#90dd90"
                  strokeWidth={2}
                  name="Meals Received"
                  dot={{ fill: "#90dd90" }}
                />
                <Line
                  type="monotone"
                  dataKey="volunteered"
                  stroke="#d490ff"
                  strokeWidth={2}
                  name="Times Volunteered"
                  dot={{ fill: "#d490ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Monthly Comparison */}
          <div className="chart-container">
            <h3>Monthly Activity</h3>
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
                <Bar dataKey="meals" fill="#90dd90" name="Meals Received" />
                <Bar
                  dataKey="volunteered"
                  fill="#d490ff"
                  name="Times Volunteered"
                />
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #e2d7a0",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2d7a0" }}
                  formatter={(value) => `${value} donations`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">42</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">68</div>
              <div className="stat-label">Meals Received</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">23</div>
              <div className="stat-label">Times Volunteered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">156</div>
              <div className="stat-label">People Helped</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
