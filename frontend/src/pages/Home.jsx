import { React, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import headerPNG from "../assets/IMG_9076.PNG";
import Logo from "../assets/Logo.png";
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
  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);

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

      <nav className={`navbar ${isFullScreen ? "fullscreen" : ""}`}>
        {/* Logo and Title */}
        <div className="navbar-left">
          <img src={Logo} alt="Logo" className="navbar-logo" />
          <p className="navbar-title">Naimat</p>
        </div>

        {/* Buttons */}
        <div className="navbar-right">
          <button className="signup-button" onClick={() => setLoginTab(true)}>
            SIGN UP
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
                    setRole("volunteer");
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

                    <form
                      className="signup-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setStep(2);
                      }}
                    >
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </span>
                      </div>
                      <button type="submit" className="submit-btn">
                        Next →
                      </button>
                    </form>

                    <div
                      className="back-option"
                      onClick={() => {
                        setShowLoginForm(false);
                        setRole("volunteer");
                      }}
                    >
                      ← Back
                    </div>
                  </>
                )}

                {/* STEP 2: OTP Verification */}
                {step === 2 && (
                  <form
                    className="signup-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Logged in successfully!");
                    }}
                  >
                    <h3>Enter OTP</h3>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                    <button type="submit" className="submit-btn">
                      Verify & Log In
                    </button>
                    <p className="back-option" onClick={() => setStep(1)}>
                      ← Back
                    </p>
                  </form>
                )}
              </>
            ) : (
              <>
                <h2 className="signup-title">Sign Up</h2>

                {/* STEP 1: Choose Method */}
                {step === 1 && (
                  <>
                    <button type="button" className="google-btn">
                      <img src={google} alt="Google" />
                      Sign Up with Google
                    </button>

                    <div className="or-divider">OR</div>

                    <form
                      className="signup-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setStep(2);
                      }}
                    >
                      <input type="email" placeholder="Email" required />
                      <button type="submit" className="submit-btn">
                        Next →
                      </button>
                    </form>

                    <div
                      className="back-option"
                      onClick={() => {
                        setShowSignupForm(false);
                        setRole("volunteer");
                      }}
                    >
                      ← Back
                    </div>
                  </>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                  <form
                    className="signup-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep(3);
                    }}
                  >
                    <h3>Verify OTP</h3>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                    <button type="submit" className="submit-btn">
                      Verify
                    </button>
                    <p className="back-option" onClick={() => setStep(1)}>
                      ← Back
                    </p>
                  </form>
                )}

                {/* STEP 3: Fill Details */}
                {step === 3 && (
                  <form
                    className="signup-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("User Registered Successfully!");
                    }}
                  >
                    <input type="text" placeholder="Full Name" />
                    <input type="text" placeholder="Username" />
                    <select name="city" id="city" required>
                      <option value="" disabled selected>
                        Select City
                      </option>
                      <option value="karachi">Karachi</option>
                      <option value="lahore">Lahore</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="rawalpindi">Rawalpindi</option>
                      <option value="faisalabad">Faisalabad</option>
                      <option value="multan">Multan</option>
                      <option value="peshawar">Peshawar</option>
                      <option value="quetta">Quetta</option>
                      <option value="sialkot">Sialkot</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="gujranwala">Gujranwala</option>
                      <option value="bahawalpur">Bahawalpur</option>
                      <option value="sukkur">Sukkur</option>
                      <option value="abbottabad">Abbottabad</option>
                      <option value="mirpur">Mirpur</option>
                    </select>
                    <input type="number" placeholder="Age" />

                    <div className="phone-field">
                      <span className="country-code">+92</span>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) setPhone(value);
                        }}
                      />
                    </div>

                    {phone.length > 0 && phone.length < 10 && (
                      <p className="error-text">
                        Must be 10 digits (after +92)
                      </p>
                    )}

                    <button type="submit" className="submit-btn">
                      Sign Up as {role}
                    </button>
                    <p className="back-option" onClick={() => setStep(2)}>
                      ← Back
                    </p>
                  </form>
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


