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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      return;
    }

    setStatus("Thank you! Your message has been received.");

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
          <form className="contactForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="inputGroup">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
              />
            </div>
            <div className="inputGroup">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />
            </div>
            <div className="inputGroup">
              <label>Message</label>
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button type="submit">Send Message</button>

            {status && <p className="formStatus">{status}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}
export default ContactPage;