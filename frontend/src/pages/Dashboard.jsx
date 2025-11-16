import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Form.css";
import "../styles/dashboard.css";
import receive from "../assets/wired-outline-981-consultation-hover-conversation.gif";
import donate from "../assets/wired-outline-412-gift-hover-squeeze.gif";
import volunteer from "../assets/wired-outline-1505-radio-walkie-talkie-hover-pinch.gif";
import { Link } from "react-router-dom";
import headerPNG from "../assets/IMG_9076.PNG";

function Dashboard() {
  return (
    <div className="form">
      <img className="img" src={headerPNG} alt="Header decoration" />
      <Navbar />
      <div className="form-header">
        <div className="form-title">Welcome!</div>
      </div>

      <section class="action-section">
        <p className="mission-title">I want to...</p>
        <Link to="/donation-form" class="action-card">
          <img src={donate} alt="Donate Icon" />
          <p>Donate</p>
        </Link>

        <Link to="/volunteer" class="action-card">
          <img src={volunteer} alt="Volunteer Icon" />
          <p>Volunteer</p>
        </Link>

        <Link to="/receive-donation" class="action-card">
          <img src={receive} alt="Receive Icon" />
          <p>Receive</p>
        </Link>
      </section>
    </div>
  );
}

export default Dashboard;
