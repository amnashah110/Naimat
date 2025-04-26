import React, { useState, useEffect } from "react";
import LoginBg from "../assets/headerBg.jpg";import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleSignIn = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    alert("Login logic is disabled in this version.");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${LoginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        margin: "0",
        padding: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <div className="overlay"/>
      {/* Blurred Box */}
      <div
        style={{
          width: "40%",
          maxWidth: "400px",
          minWidth: "400px",
          height: "95%",
          backgroundColor: "rgba(0, 0, 0, 0.59)",
          backdropFilter: "blur(5px)",
          borderRadius: "10px",
          boxShadow: "1px 2px 10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative"
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "Poppins",
            fontSize: "40px",
            color: "#fff",
            margin: "0 0 5px 0",
            textShadow: "1px 2px 4px rgba(0, 0, 0, 0.6)",
          }}
        >
          LOGIN
        </h1>

        <Link to="/">
            <button style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                backgroundColor: "rgba(0, 0, 0, 0.34)",
                color: "white",
                fontFamily: "Poppins",
                fontWeight: "bold",
                fontSize: "27px",
                borderRadius: "10px",
                border: "none",
                padding: "5px 10px"
            }}
            onMouseEnter={(e) => (
                (e.target.style.boxShadow = "0px 0px 15px rgb(0, 0, 0, 0.6)")
              )}
              onMouseLeave={(e) => (
                (e.target.style.boxShadow = "1px 2px 2px rgb(0, 0, 0, 0.5)")
              )}
            >
                X
            </button>
        </Link>

        {/* Input Box */}
        <div style={{ width: "80%", maxWidth: "350px", fontFamily: "Poppins", marginLeft: "-25px"}}>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <label
              style={{
                position: "absolute",
                left: "10px",
                top: username ? "0px" : "65%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.7)",
                transition: "0.2s ease all",
                pointerEvents: "none",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => (e.target.previousSibling.style.top = "0px")}
              onBlur={(e) => {
                if (!e.target.value) e.target.previousSibling.style.top = "65%";
              }}
              style={{
                width: "100%",
                padding: "15px 10px 5px 10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "2px solid white",
                backgroundColor: "rgba(0,0,0,0.2)",
                color: "white",
                outline: "none",
                marginTop: "20px",
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
              <label
                style={{
                  position: "absolute",
                  left: "10px",
                  top: password ? "0px" : "65%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.7)",
                  transition: "0.2s ease all",
                  pointerEvents: "none",
                }}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.previousSibling.style.top = "0px")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.previousSibling.style.top = "65%";
                }}
                style={{
                  width: "100%",
                  padding: "15px 10px 5px 10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "2px solid white",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "white",
                  outline: "none",
                  marginTop: "20px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  right: "0",
                  marginTop: "10px"
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

        
          <button
            className="buttons"
            style={{
              backgroundColor: "rgb(41, 41, 41)",
              fontFamily: "Poppins",
              fontWeight: "bold",
              padding: "10px 15px",
              borderRadius: "10px",
              border: "none",
              fontSize: "18px",
              boxShadow: "1px 2px 2px rgb(0, 0, 0, 0.5)",
              marginTop: "20px",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (
                (e.target.style.boxShadow =
                "0px 0px 15px rgb(170, 168, 168)"),
                (e.target.style.color = "white")
            )}
            onMouseLeave={(e) => (
                (e.target.style.boxShadow = "1px 2px 2px rgb(0, 0, 0, 0.5)"),
                (e.target.style.color = "black")
            )}
            onClick={handleSignIn}
          >
            LOGIN
          </button>
  
      </div>
    </div>
  );
}
