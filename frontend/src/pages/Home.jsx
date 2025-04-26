import { React, useState, useEffect } from "react";
import "../styles/Home.css";
import "../styles/fonts.css";
import "../styles/animations.css";
import headerPNG from "../assets/IMG_9076.PNG";
import Logo from "../assets/Logo.PNG";
import one from "../assets/IMG_9074.PNG";
import two from "../assets/IMG_9075.PNG";
import three from "../assets/IMG_9077.PNG";
import { Link } from "react-router-dom";

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
          padding: "1rem",
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
          }}
        >
          <img
            src={Logo}
            alt="Logo"
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
              fontSize: isFullScreen ? "3rem" : "2rem",
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
          <Link to="/signup">
            <button
              className="signup-button"
              onMouseEnter={(e) => (
                (e.target.style.boxShadow = "0px 0px 20px rgba(245, 201, 44)"),
                (e.target.style.color = "white")
              )}
              onMouseLeave={(e) => (
                (e.target.style.boxShadow = "1px 2px 2px rgb(0, 0, 0, 0.5)"),
                (e.target.style.color = "black")
              )}
            >
              SIGN UP
            </button>
          </Link>
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
                  height: "300px",
                  position: "relative",
                  top: "20px",
                  margin: "-30px 0 25px 0",
                  padding: "0",
                  height: "60vh",
                  maxheight: "200px",
                }}
              >
                {/* Card Display */}
                <Link
                  to="/"
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
                </Link>

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
              <Link to="/signup" className="joinus-button">
                Join Community
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
