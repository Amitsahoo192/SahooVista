
import { useEffect, useRef, useState } from "react";
import "./aboutPage.scss";

function AboutPage() {
  const pageRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = pageRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`aboutPage ${visible ? "pageVisible" : ""}`}
      ref={pageRef}
    >
      <div className="wrapper">
        <section className="hero">
          <span className="eyebrow">ABOUT SAHOOVISTA</span>

          <h1>
            Making Real Estate Simple,{" "}
            <span>Transparent & Accessible.</span>
          </h1>

          <p>
            Finding a property is more than searching for a place. It is about
            discovering somewhere that fits your needs, your plans, and your
            lifestyle. SahooVista makes that journey simpler with a convenient
            platform for exploring property listings and connecting with
            property owners.
          </p>
        </section>

        <section className="aboutContent">
          <div className="content">
            <span className="sectionLabel">GET TO KNOW US</span>
            <h2>Who We Are</h2>

            <p>
              SahooVista is a modern real-estate platform built to make
              property discovery easier and more accessible. We bring property
              information and discovery tools together so users can explore
              available options in one place.
            </p>

            <p>
              Whether you are looking for a home, an apartment, or a property
              for investment, our platform helps you explore listings, compare
              details, discover locations, and connect with property owners.
            </p>

            <h2>Our Mission</h2>

            <p>
              Our mission is to make the property search experience more
              straightforward through useful information, intuitive features,
              and a user-friendly digital experience for property seekers and
              owners.
            </p>

            <h2>Our Vision</h2>

            <p>
              We aim to build a trusted and accessible digital destination
              where discovering properties and taking the next step feels
              simpler, clearer, and more convenient.
            </p>
          </div>

          <div className="highlights">
            <div className="card">
              <span className="cardNumber">01</span>
              <h3>Discover</h3>
              <p>
                Explore property listings, review important details, and find
                options that match your requirements.
              </p>
            </div>

            <div className="card">
              <span className="cardNumber">02</span>
              <h3>Connect</h3>
              <p>
                Find relevant property information and connect with owners to
                discuss the next steps.
              </p>
            </div>

            <div className="card">
              <span className="cardNumber">03</span>
              <h3>Choose</h3>
              <p>
                Compare your options and use the available listing details to
                make informed property decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="closingSection">
          <span className="sectionLabel">YOUR PROPERTY JOURNEY</span>
          <h2>A simpler way to find your next place.</h2>
          <p>
            Explore your options, discover new possibilities, and take your
            next step with SahooVista.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
