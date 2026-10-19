
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";

function AnimatedCounter({ value, suffix = "", active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frameId;
    let startTime;
    const duration = 1400;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.round(eased * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, active]);

  return <>{count}{suffix}</>;
}

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const searchRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setStatsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleExplore = () => {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    searchRef.current?.querySelector("input")?.focus({
      preventScroll: true,
    });
  };

  return (
    <main className="homePage">
      <section className="textContainer">
        <div className="wrapper">
          <div className="heroBadge">
            <span className="badgeDot"></span>
            A better way to find your place
          </div>

          <h1 className="title">
            Find Your Perfect Place to
            <span >Call Home.</span>
          </h1>

          <p className="heroDescription">
            Discover beautiful properties in the right location and find a
            place that fits your lifestyle. Explore trusted listings, compare
            your options, and take the next step toward your dream home with
            SahooVista.
          </p>

          {currentUser && (
            <p className="welcomeMessage">
              Welcome back,{" "}
              {currentUser.username || currentUser.name || "there"}.
            </p>
          )}

          <div className="searchSection" ref={searchRef}>
            <div className="searchHeading">
              <div>
                <h2>Find your place</h2>
                <p>Discover a property that feels right.</p>
              </div>
              <span className="searchAccent" aria-hidden="true">↘</span>
            </div>

            <div className="searchCard">
              <SearchBar />
            </div>
          </div>

          <div className="boxes" ref={statsRef}>
            <div className="box">
              <span className="statNumber">
                <AnimatedCounter value={1} suffix="+" active={statsVisible} />
              </span>
              <span className="statLabel">Years of Experience</span>
            </div>

            <div className="box">
              <span className="statNumber">
                <AnimatedCounter value={2} active={statsVisible} />
              </span>
              <span className="statLabel">Awards Gained</span>
            </div>

            <div className="box">
              <span className="statNumber">
                <AnimatedCounter value={200} suffix="+" active={statsVisible} />
              </span>
              <span className="statLabel">Properties Ready</span>
            </div>
          </div>

          <button
            type="button"
            className="exploreButton"
            onClick={handleExplore}
          >
            Explore properties <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="imgContainer" aria-label="Modern buildings">
        <div className="rotatingStar" aria-hidden="true">✹</div>

        <img
          className="heroImage"
          src="/bg.png"
          alt="Modern buildings"
        />
      </section>
    </main>
  );
}

export default HomePage;
