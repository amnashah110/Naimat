import React, { useState } from "react";
import Navbar from "../components/Navbar";
import headerPNG from "../assets/IMG_9076.PNG";
import "../styles/Form.css";
import "../styles/receiver.css";

function Receiver() {
  const donationsData = [
    {
      id: 1,
      type: "Food",
      date: "2025-11-10",
      address: "Gulshan-e-Iqbal, Karachi",
    },
    {
      id: 2,
      type: "Clothes",
      date: "2025-11-08",
      address: "Model Town, Lahore",
    },
    {
      id: 3,
      type: "Medicine",
      date: "2025-11-12",
      address: "University Road, Peshawar",
    },
    { id: 4, type: "Food", date: "2025-11-09", address: "Saddar, Rawalpindi" },
    { id: 5, type: "Books", date: "2025-11-07", address: "Defence, Karachi" },
    { id: 6, type: "Clothes", date: "2025-11-11", address: "Cantt, Lahore" },
  ];

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  const filteredDonations = donationsData.filter(
    (d) => filter === "All" || d.type === filter
  );

  const sortedDonations = [...filteredDonations].sort((a, b) => {
    return sort === "Newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="form">
      <Navbar />
      <img className="img" src={headerPNG} alt="Header decoration" />

      <div className="form-header">
        <div className="form-title">Available Donations</div>
      </div>

      <div className="donations-body">
        <div className="filter-sort-bar">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Food</option>
              <option>Clothes</option>
              <option>Medicine</option>
              <option>Books</option>
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
                <div className="donation-glow"></div>
                <div className="donation-content">
                  <div className="donation-info">
                    <h3 className="donation-type">{donation.type}</h3>
                    <p className="donation-date">
                      📅 {new Date(donation.date).toLocaleDateString()}
                    </p>
                    <p className="donation-address">📍 {donation.address}</p>
                  </div>

                  <div className="donation-actions">
                    <button className="accept-btn">Accept Donation</button>
                    <button className="details-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Receiver;
