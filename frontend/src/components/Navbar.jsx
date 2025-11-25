import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // ✅ for hamburger icons (install: npm i lucide-react)
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { logout, user } = useUser();
  const [userRole, setUserRole] = useState("donor");
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/my-donations", label: "My Donations" },
  ];

  const getLinkStyle = (linkName, path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive
        ? "rgba(240, 226, 147, 1)"
        : "rgba(255, 248, 224, 1)",
      textShadow: "1px 1px 3px rgba(250, 240, 211, 0.2)",
      transition: "color 0.3s ease",
      fontSize: "1.1em",
      cursor: "pointer",
      textDecoration: "none",
      fontFamily: "DM Sans",
    };
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) setIsMenuOpen(false); // auto-close on expand
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem .5rem",
        boxShadow: "0 5px 20px rgba(20, 20, 20, 0.95)",
        zIndex: 1000,
      }}
    >
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
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
            fontFamily: "Arizonia",
            color: "rgb(251, 243, 187)",
            fontSize: "3rem",
            textShadow: "0px 0px 15px rgba(253, 253, 211, 0.79)",
            margin: 0,
          }}
        >
          Naimat
        </p>
      </div>

      {isFullScreen ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2vw",
            fontFamily: "DM Sans",
            fontWeight: "bold",
            marginRight: "4%",
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

          {/* User Dropdown */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                color: "rgba(255, 248, 224, 1)",
                fontSize: "1.1em",
                cursor: "pointer",
                fontFamily: "DM Sans",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Welcome, {user?.name.split(" ")[0] || "User"} ▼
            </div>
            
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "8px 0",
                  minWidth: "150px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  zIndex: 5000
                }}
              >
                <div
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    color: "rgba(255, 248, 224, 1)",
                    cursor: "pointer",
                    fontSize: "1em",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  Profile
                </div>
                <div
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    color: "rgba(255, 248, 224, 1)",
                    cursor: "pointer",
                    fontSize: "1em",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  Logout
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        <>
          {/* Hamburger Icon */}
          <button
            onClick={toggleMenu}
            style={{
              background: "none",
              border: "none",
              color: "rgba(253, 243, 208, 1)",
              cursor: "pointer",
              marginRight: "2rem"
            }}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem 0",
                gap: "1rem",
                zIndex: 4000,
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    ...getLinkStyle(label, to),
                    fontSize: "1.2rem",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <div
                style={{
                  color: "rgba(255, 248, 224, 1)",
                  fontSize: "1.2rem",
                  fontFamily: "DM Sans",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  width: "80%",
                  textAlign: "center"
                }}
              >
                Logged in as {user?.name || "User"}
              </div>

              <span
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                style={{
                  ...getLinkStyle("Profile", "/profile"),
                  fontSize: "1.2rem",
                  cursor: 'pointer',
                }}
              >
                Profile
              </span>

              <span
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                style={{
                  ...getLinkStyle("Logout", "#"),
                  fontSize: "1.2rem",
                  cursor: 'pointer',
                }}
              >
                Logout
              </span>

            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
