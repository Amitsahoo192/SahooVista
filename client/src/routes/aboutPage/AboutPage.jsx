import "./aboutPage.scss";

function AboutPage() {
  return (
    <div className="aboutPage">
      <div className="wrapper">
        <section className="hero">
          <span>ABOUT SAHOOVISTA</span>
          <h1>Making Real Estate Simple, Transparent & Accessible</h1>
          <p>
            SahooVista is a modern real-estate platform designed to connect
            people with properties that match their needs, preferences, and
            lifestyle.
          </p>
        </section>

        <section className="aboutContent">
          <div className="content">
            <h2>Who We Are</h2>

            <p>
              At SahooVista, we believe finding the right property should be
              simple, informed, and convenient. Our platform brings property
              discovery and communication together in one seamless experience.
            </p>

            <p>
              From exploring detailed property listings to discovering
              locations and connecting with property owners, SahooVista is
              built to make every step of the property search process easier.
            </p>

            <h2>Our Mission</h2>

            <p>
              Our mission is to create a reliable and user-friendly digital
              experience for property seekers and property owners. We aim to
              make real estate discovery more straightforward by providing
              relevant information and intuitive tools in one place.
            </p>
          </div>

          <div className="highlights">
            <div className="card">
              <h3>01</h3>
              <h2>Discover</h2>
              <p>
                Explore properties and find options that align with your
                requirements.
              </p>
            </div>

            <div className="card">
              <h3>02</h3>
              <h2>Connect</h2>
              <p>
                Communicate directly and take the next step toward your ideal
                property.
              </p>
            </div>

            <div className="card">
              <h3>03</h3>
              <h2>Decide</h2>
              <p>
                Access the information you need to make confident property
                decisions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;