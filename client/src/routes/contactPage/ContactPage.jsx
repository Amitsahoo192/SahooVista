
import { useState } from "react";
import "./ContactPage.scss";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStatus("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus("Please fill in all fields.");
      setStatusType("error");
      return;
    }

    setStatus("Thank you! Your message has been received.");
    setStatusType("success");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contactPage">
      <div className="wrapper">
        <section className="hero">
          <span className="eyebrow">CONTACT SAHOOVISTA</span>

          <h1>
            Let&apos;s Find the Right <span>Property for You.</span>
          </h1>

          <p>
            Have a question about a property, need assistance, or want to know
            more about SahooVista? Get in touch with us. We&apos;re here to make
            your property search simpler.
          </p>
        </section>

        <section className="contactContent">
          <div className="contactInfo">
            <span className="sectionLabel">WE&apos;RE HERE TO HELP</span>
            <h2>Get in Touch</h2>

            <p className="infoDescription">
              Whether you&apos;re looking for your next home or need help with a
              property listing, send us your questions and let us know how we
              can help.
            </p>

            <div className="infoItem">
              <span className="infoNumber">01</span>
              <div>
                <h3>Email</h3>
                <a href="mailto:support@sahoovista.com">
                  support@sahoovista.com
                </a>
              </div>
            </div>

            <div className="infoItem">
              <span className="infoNumber">02</span>
              <div>
                <h3>Phone</h3>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
            </div>

            <div className="infoItem">
              <span className="infoNumber">03</span>
              <div>
                <h3>Location</h3>
                <p>Bhubaneswar, Odisha, India</p>
              </div>
            </div>

            <div className="contactNote">
              <h3>Let&apos;s talk property.</h3>
              <p>
                Share your query with us, and take the next step in your
                property journey.
              </p>
            </div>
          </div>

          <form className="contactForm" onSubmit={handleSubmit}>
            <div className="formHeading">
              <h2>Send Us a Message</h2>
              <p>Fill in the details below to get started.</p>
            </div>

            <div className="inputGroup">
              <label htmlFor="contactName">Full Name</label>
              <input
                id="contactName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="contactEmail">Email Address</label>
              <input
                id="contactEmail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="contactSubject">Subject</label>
              <input
                id="contactSubject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What would you like to discuss?"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="contactMessage">Your Message</label>
              <textarea
                id="contactMessage"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
              ></textarea>
            </div>

            <button type="submit">
              Send Message <span aria-hidden="true">↗</span>
            </button>

            {status && (
              <p className={`formStatus ${statusType}`} role="status">
                {status}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
