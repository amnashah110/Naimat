import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userRole, setUserRole] = useState("donor"); // "donor", "recipient", or null

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { 
    to: userRole === "donor" 
      ? "/donation-form" 
      : userRole === "recipient" 
        ? "/request-help-form" 
        : "/", 
    label: userRole === "donor" 
      ? "Donation Form" 
      : userRole === "recipient" 
        ? "Request Help Form" 
        : "" 
  },
];


  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")) || {
    firstName: "User",
    gender: null,
  };
  const imageNum = Math.floor(Math.random() * 5) + 1;

  const getLinkStyle = (linkName, path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive
        ? "white"
        : hoveredLink === linkName
        ? "rgb(246, 246, 162)"
        : "rgb(235, 189, 37)",
      textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
      transition: "color 0.3s ease",
      fontSize: "1.1em",
      cursor: "pointer",
      textDecoration: "none",
    };
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleViewProfile = () => {
    setIsProfileMenuOpen(false);
    navigate("/profile");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          height: isFullScreen ? "10%" : "6%",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
          animation: "slideIn 0.6s ease-out",
        }}
      >
        {/* Logo and Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: isFullScreen ? "-2%" : "-4%",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: isFullScreen ? "80px" : "60px",
              rotate: "30deg",
              marginTop: "-8px",
            }}
          />
          <p
            style={{
              fontFamily: "Significent",
              color: "rgb(251, 243, 187)",
              fontSize: isFullScreen ? "3rem" : "2rem",
              letterSpacing: "1px",
              textShadow: "1px 1px 1px rgba(13, 39, 59, 0.57)",
              margin: 0,
            }}
          >
            Naimat
          </p>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2vw",
            fontFamily: "Poppins",
            fontWeight: "bold",
            marginRight: isFullScreen ? "4%" : "6%"
          }}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={getLinkStyle(label, to)}
              onMouseEnter={() => setHoveredLink(label)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={toggleProfileMenu}
            onMouseEnter={() => setHoveredLink("Profile")}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              ...getLinkStyle("Profile", "/profile"),
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "Poppins",
            }}
          >
            Profile
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: "4rem",
                backgroundColor: "rgb(29, 29, 29)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                width: "200px",
                zIndex: 1001,
                padding: "1rem 0",
                textAlign: "center",
                color: "white",
              }}
            >
              <div
                style={{
                  width: isFullScreen ? "100px" : "64px",
                  height: isFullScreen ? "100px" : "64px",
                  borderRadius: "50%",
                  backgroundImage: `url(${
                    !userData.gender
                      ? "/unknown.jpg"
                      : userData.gender === "F"
                      ? `/girls/${imageNum}.jpg`
                      : `/boys/${imageNum}.jpg`
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "0 auto 10px",
                }}
              />
              <p style={{ fontSize: "1.1em", margin: "5px 0" }}>
                {userData.firstName}
              </p>
              <hr style={{ borderColor: "silver", margin: "10px auto", width: "80%" }} />
              <button
                onClick={handleViewProfile}
                style={{
                  background: "none",
                  border: "none",
                  color: "silver",
                  fontSize: "1.1em",
                  cursor: "pointer",
                  padding: "8px 0",
                  width: "100%",
                }}
              >
                View Profile
              </button>
              <hr style={{ borderColor: "silver", margin: "10px auto", width: "80%" }} />
              <Link
                to="/"
                style={{
                  fontSize: "1.1em",
                  color: "silver",
                  textDecoration: "none",
                  display: "block",
                  paddingBottom: "10px",
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
