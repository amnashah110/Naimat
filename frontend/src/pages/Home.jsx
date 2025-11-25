import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/animations.css";
import headerPNG from "../assets/IMG_9076.PNG";
import Logo from "../assets/Logo.png";
import one from "../assets/IMG_9074.PNG";
import two from "../assets/IMG_9075.PNG";
import three from "../assets/IMG_9077.PNG";
import { useUser } from "../context/UserContext";

function Home() {
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const missionTexts = [
    {
      id: 1,
      image: one,
      text: "Connecting surplus food to those in need, reducing waste and nourishing communities.",
    },
    {
      id: 2,
      image: two,
      text: "Empowering donors and NGOs to share blessings through efficient, real-time food redistribution.",
    },
    {
      id: 3,
      image: three,
      text: "Transforming excess into impact by matching food donations with local demand.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLiner, setShowLiner] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [loginTab, setLoginTab] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % missionTexts.length);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + missionTexts.length) % missionTexts.length
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowLiner(true);
    }, 4000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowImage(true);
    }, 6000);
  }, []);

  useEffect(() => {
    if (!loginTab) {
      setShowLoginForm(false);
      setShowSignupForm(false);
      setPhone("");
      setShowPassword(false);
      setShowConfirm(false);
      setEmail("");
      setOtp("");
      setError("");
      setStep(1);
    }
  }, [loginTab]);

  // Request OTP code
  const handleRequestOTP = async (emailInput, isSignup = false) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/auth/passwordless/requestcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: emailInput,
          isSignup: isSignup 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      const data = await response.json();
      console.log("OTP sent:", data);
      return true;
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP code
  const handleVerifyOTP = async (emailInput, otpCode, isSignup = false) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/auth/passwordless/verifycode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: emailInput, 
          code: otpCode 
        }),
      });

      const data = await response.json();

      // For signup, user might not exist yet - that's okay
      if (!response.ok) {
        if (isSignup && data.message?.includes("Email doesn't exist")) {
          // For signup, OTP is valid but user doesn't exist yet
          // We'll create the user in step 3
          console.log("OTP verified for new user signup");
          return { verified: true, isNewUser: true };
        }
        throw new Error(data.message || "Invalid OTP");
      }

      console.log("Login successful:", data);
      
      // Store tokens in localStorage
      if (data.jwtToken) {
        localStorage.setItem("access_token", data.jwtToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refresh_token", data.refreshToken);
      }

      return { verified: true, isNewUser: false, tokens: data };
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new user account
  const handleSignupUser = async (userData) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://naimat-backend-f9drh3fcceewebcd.southeastasia-01.azurewebsites.net/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      const data = await response.json();
      console.log("User created successfully:", data);
      
      // Store tokens in localStorage
      if (data.jwt) {
        localStorage.setItem("access_token", data.jwt);
      }
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      return data;
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.message || "Failed to create account. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage">
      {showImage && (
        <img className="img" src={headerPNG} alt="Header decoration" />
      )}

      <nav className={`navbar ${isFullScreen ? "fullscreen" : ""}`}>
        {/* Logo and Title */}
        <div className="navbar-left">
          <img src={Logo} alt="Logo" className="navbar-logo" />
          <p className="navbar-title">Naimat</p>
        </div>

        {/* Buttons */}
        <div className="navbar-right">
          <button className="signup-button" onClick={() => setLoginTab(true)}>
            LOGIN/SIGNUP
          </button>
        </div>
      </nav>

      <section className="header">
        <div className="overlay" />
        <div className="title-grid">
          <div className="title">نعمت</div>
          <div className="subtitle">
            <i>n. Blessings, Favor</i>
          </div>
        </div>
      </section>

      {showLiner && (
        <>
          <section className="liner">
            <div className="liner-text">
              Let's share the naimat;{" "}
              <strong>turning surplus into support</strong>
            </div>
          </section>

          <section className="mission-joinus">
            <div className="mission-box">
              <p className="mission-title">Our Mission</p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "300px",
                  position: "relative",
                  top: "20px",
                  margin: "-30px 0 25px 0",
                  padding: "0",
                }}
              >
                {/* Card Display */}
                <div
                  className="card"
                  style={{
                    backgroundImage: `url(${missionTexts[currentIndex].image})`,

                    backgroundSize: currentIndex === 2 ? "300px" : "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPositionY: currentIndex === 2 ? "50px" : "center",
                  }}
                >
                  <div className="overlay" />
                  <div className="card-text">
                    {missionTexts[currentIndex].text}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevCard}
                  className="arrow"
                  style={{ left: "-10%" }}
                >
                  ❮
                </button>

                <button
                  onClick={nextCard}
                  className="arrow"
                  style={{ right: "-10%" }}
                >
                  ❯
                </button>
              </div>
            </div>

            <div className="joinus-box">
              <div className="joinus-title">Join us!</div>
              <div className="joinus-text">
                Join the mission to reduce waste and spread kindness
              </div>
              <div
                className="joinus-button"
                onClick={() => {
                  setLoginTab(true);
                }}
              >
                Join Community
              </div>
            </div>
          </section>
        </>
      )}

      {loginTab && (
        <>
          <div className="overlay-screen" onClick={() => setLoginTab(false)} />

          <div className="signup-dialog">
            {!showSignupForm && !showLoginForm ? (
              <>
                <h2 className="signup-title">Welcome!</h2>
                <p className="signup-subtext">
                  Do you already have an account or would you like to sign up?
                </p>

                <div className="login-signup-choice">
                  <button
                    className="choice-btn"
                    onClick={() => {
                      setShowLoginForm(true);
                      setStep(1);
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className="choice-btn"
                    onClick={() => {
                      setShowSignupForm(true);
                      setStep(1);
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                <div
                  className="back-option"
                  onClick={() => {
                    setLoginTab(false);
                    setShowSignupForm(false);
                    setShowLoginForm(false);
                  }}
                >
                  ← Back
                </div>
              </>
            ) : showLoginForm ? (
              <>
                <h2 className="signup-title">Log In</h2>

                {/* STEP 1: Login Option */}
                {step === 1 && (
                  <>
                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                    <form
                      className="signup-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const emailValue = e.target.elements[0].value;
                        setEmail(emailValue);
                        
                        const success = await handleRequestOTP(emailValue, false); // false = login
                        if (success) {
                          setStep(2);
                        }
                      }}
                    >
                      <input 
                        type="email" 
                        placeholder="Email" 
                        required
                        disabled={isLoading}
                      />
                      <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Next →"}
                      </button>
                    </form>

                    <div
                      className="back-option"
                      onClick={() => {
                        setShowLoginForm(false);
                        setError("");
                      }}
                    >
                      ← Back
                    </div>
                  </>
                )}

                {/* STEP 2: OTP Verification */}
                {step === 2 && (
                  <>
                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    
                    <form
                      className="signup-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const result = await handleVerifyOTP(email, otp, false);
                        
                        if (result && result.verified) {
                          // Refresh user context and wait for it to complete
                          await refreshUser();
                          setLoginTab(false);
                          alert("Logged in successfully!");
                          // Navigate to dashboard
                          navigate("/dashboard");
                        }
                      }}
                    >
                      <h3>Enter OTP</h3>
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                        Code sent to {email}
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={isLoading}
                      />
                      <button type="submit" className="submit-btn" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? "Verifying..." : "Verify & Log In"}
                      </button>
                      <p className="back-option" onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                      }}>
                        ← Back
                      </p>
                    </form>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="signup-title">Sign Up</h2>

                {/* STEP 1: Choose Method */}
                {step === 1 && (
                  <>
                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                    <form
                      className="signup-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const emailValue = e.target.elements[0].value;
                        setEmail(emailValue);
                        
                        const success = await handleRequestOTP(emailValue, true); // true = signup
                        if (success) {
                          setStep(2);
                        }
                      }}
                    >
                      <input type="email" placeholder="Email" required disabled={isLoading} />
                      <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Next →"}
                      </button>
                    </form>

                    <div
                      className="back-option"
                      onClick={() => {
                        setShowSignupForm(false);
                        setError("");
                      }}
                    >
                      ← Back
                    </div>
                  </>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                  <>
                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    
                    <form
                      className="signup-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const result = await handleVerifyOTP(email, otp, true);
                        
                        if (result && result.verified) {
                          // OTP verified, proceed to fill details
                          setStep(3);
                        }
                      }}
                    >
                      <h3>Verify OTP</h3>
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                        Code sent to {email}
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={isLoading}
                      />
                      <button type="submit" className="submit-btn" disabled={isLoading || otp.length !== 6}>
                        {isLoading ? "Verifying..." : "Verify"}
                      </button>
                      <p className="back-option" onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                      }}>
                        ← Back
                      </p>
                    </form>
                  </>
                )}

                {/* STEP 3: Fill Details */}
                {step === 3 && (
                  <>
                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                    
                    <form
                      className="signup-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        
                        const formData = new FormData(e.target);
                        const userData = {
                          name: formData.get('name'),
                          email: email,
                          auth_provider: 'Email',
                        };

                        const result = await handleSignupUser(userData);
                        
                        if (result) {
                          // Refresh user context and wait for it to complete
                          await refreshUser();
                          setLoginTab(false);
                          alert("User Registered Successfully! You are now logged in.");
                          // Navigate to dashboard
                          navigate("/dashboard");
                        }
                      }}
                    >
                    <p>What should we call you?</p>
                    <input type="text" placeholder="Full Name" name="name" required disabled={isLoading} />

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : `Sign Up`}
                    </button>
                    <p className="back-option" onClick={() => {
                      setStep(2);
                      setError("");
                    }}>
                      ← Back
                    </p>
                  </form>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
