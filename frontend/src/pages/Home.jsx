import { React, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import headerPNG from "../assets/IMG_9076.PNG";
import logo from "../assets/Logo.png";
import one from "../assets/IMG_9074.PNG";
import two from "../assets/IMG_9075.PNG";
import three from "../assets/IMG_9077.PNG";
import google from "../assets/google.png";
import { Eye, EyeOff } from "lucide-react";

function Home() {
  const missionTexts = [
    {
      id: 1,
      image: one,
      text: "Connecting surplus food to those in need, reducing waste and nourishing communities",
    },
    {
      id: 2,
      image: two,
      text: "Empowering donors and NGOs to share blessings through efficient, real-time food redistribution",
    },
    {
      id: 3,
      image: three,
      text: "Transforming excess into impact by matching food donations with local demand",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLiner, setShowLiner] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(window.innerWidth >= 1024);
  const [loginTab, setLoginTab] = useState(false);
  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [phone, setPhone] = useState("");

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
      // Reset everything when login tab closes
      setShowLoginForm(false);
      setShowSignupForm(false);
      setRole("volunteer");
      setPhone("");
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [loginTab]);

  return (
    <div className="homepage">
      {showImage && (
        <img className="img" src={headerPNG} alt="Header decoration" />
      )}

      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: isFullScreen ? "10%" : "6%",
          padding: isFullScreen ? ".5rem" : "1rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 1000,
          animation: "slideIn 0.6s ease-out",
        }}
      >
        {/* logo and Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: isFullScreen ? "80px" : "60px",
              rotate: "30deg",
              marginTop: "-8px",
              marginLeft: isFullScreen ? "-2%" : "-4%",
            }}
          />
          <p
            style={{
              fontFamily: "Significent",
              color: "rgb(251, 243, 187)",
              fontSize: isFullScreen ? "2.5rem" : "3rem",
              letterSpacing: "1px",
              textShadow: "1px 1px 1px rgba(13, 39, 59, 0.57)",
              margin: 0,
            }}
          >
            Naimat
          </p>
        </div>

        {/* Navbar Buttons */}
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "end",
            alignContent: "center",
            marginRight: "30px",
            columnGap: "10px",
            padding: "-10px",
          }}
        >
          <div>
            <button
              className="signup-button"
              onClick={() => {
                setLoginTab(true);
              }}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </nav>

      <section className="header">
        <div className="overlay" />
        <p className="title">نعمت</p>
        <p className="subtitle">
          <i>n. Blessings, Favor</i>
        </p>
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
                  position: "relative",
                  top: "20px",
                  margin: "-30px 0 25px 0",
                  padding: "0",
                  height: "60vh",
                  maxHeight: "200px",
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
                    onClick={() => setShowLoginForm(true)}
                  >
                    Log In
                  </button>
                  <button
                    className="choice-btn"
                    onClick={() => setShowSignupForm(true)}
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
                    setRole("volunteer");
                  }}
                  style={{ display: "block" }}
                >
                  ← Back
                </div>
              </>
            ) : showLoginForm ? (
              <>
                <h2 className="signup-title">Log In</h2>

                <div className="role-toggle">
                  <button
                    className={role === "volunteer" ? "active" : ""}
                    onClick={() => setRole("volunteer")}
                  >
                    Volunteer
                  </button>
                  <button
                    className={role === "recipient" ? "active" : ""}
                    onClick={() => setRole("recipient")}
                  >
                    Recipient
                  </button>
                  <button
                    className={role === "donor" ? "active" : ""}
                    onClick={() => setRole("donor")}
                  >
                    Donor
                  </button>
                </div>

                <button type="button" className="google-btn">
                  <img src={google} alt="Google" />
                  Log In with Google
                </button>

                <div className="or-divider">OR</div>

                <form className="signup-form">
                  <input type="text" placeholder="Email or Username" />

                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <button type="submit" className="submit-btn">
                    Log In
                  </button>
                </form>

                <p
                  className="back-option"
                  onClick={() => {setShowLoginForm(false); setRole("volunteer");}}
                >
                  ← Back
                </p>
              </>
            ) : (
              <>
                <h2 className="signup-title">Sign Up</h2>

                <div className="role-toggle">
                  <button
                    className={role === "volunteer" ? "active" : ""}
                    onClick={() => setRole("volunteer")}
                  >
                    Volunteer
                  </button>
                  <button
                    className={role === "recipient" ? "active" : ""}
                    onClick={() => setRole("recipient")}
                  >
                    Recipient
                  </button>
                  <button
                    className={role === "donor" ? "active" : ""}
                    onClick={() => setRole("donor")}
                  >
                    Donor
                  </button>
                </div>

                <button type="button" className="google-btn">
                  <img src={google} alt="Google" />
                  Sign Up with Google
                </button>

                <div className="or-divider">OR</div>

                <form className="signup-form">
                  <input type="text" placeholder="Full Name" />
                  <input type="email" placeholder="Email" />
                  <input type="text" placeholder="Username" />
                  <input type="text" placeholder="City" />
                  <input type="number" placeholder="Age" />

                  <div className="phone-field">
                    <span className="country-code">+92</span>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // digits only
                        if (value.length <= 10) setPhone(value);
                      }}
                      required
                    />
                  </div>

                  {phone.length > 0 && phone.length < 10 && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.9rem",
                        marginTop: "4px",
                      }}
                    >
                      Must be 10 digits (after +92)
                    </p>
                  )}

                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <div className="password-field">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign Up as{" "}
                    {role === "volunteer"
                      ? "Volunteer"
                      : role === "recipient"
                      ? "Recipient"
                      : "Donor"}
                  </button>
                </form>

                <p
                  className="back-option"
                  onClick={() => {setShowSignupForm(false); setRole("volunteer");}}
                >
                  ← Back
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;



