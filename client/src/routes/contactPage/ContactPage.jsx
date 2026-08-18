
import "./ContactPage.scss";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="wrapper">
        <section className="hero">
          <span>CONTACT SAHOOVISTA</span>
          <h1>Let’s Find the Right Property for You</h1>
          <p>
            Have a question about a property, need assistance, or want to know
            more about SahooVista? Our team is here to help.
          </p>
        </section>

        <section className="contactContent">
          <div className="contactInfo">
            <h2>Get in Touch</h2>
            <p>
              Whether you are looking for your next home or need help with a
              property listing, feel free to reach out to us.
            </p>

            <div className="infoItem">
              <h3>Email</h3>
              <p>support@sahoovista.com</p>
            </div>

            <div className="infoItem">
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>

            <div className="infoItem">
              <h3>Office</h3>
              <p>Bhubaneswar, Odisha, India</p>
            </div>
          </div>

          <form className="contactForm">
            <div className="inputGroup">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>

            <div className="inputGroup">
              <label>Email</label>
              <input type="email" placeholder="Your email" />
            </div>

            <div className="inputGroup">
              <label>Subject</label>
              <input type="text" placeholder="How can we help?" />
            </div>

            <div className="inputGroup">
              <label>Message</label>
              <textarea
                rows="6"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button type="submit">Send Message</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;

