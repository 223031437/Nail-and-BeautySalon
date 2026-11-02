import React, { useState } from "react";
import { submitInquiry } from "../services/bookingService";
import { getErrorMessage, getFieldErrors } from "../services/api";
import FieldError from "../components/FieldError";
import { hasErrors, required, validEmail, validPhone } from "../utils";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const SUBJECTS = [
  ["General_Enquiry", "General enquiry"],
  ["Booking_Enquiry", "Booking enquiry"],
  ["Customer_Feedback", "Feedback"],
  ["Billing_and_Accounts", "Billing and payments"],
  ["Sales", "Products and sales"],
  ["Technical_Support", "Website help"],
];

const emptyForm = { fullName: "", email: "", phoneNumber: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setResult(null);

    const found = {
      fullName: required(form.fullName, "Name"),
      email: validEmail(form.email),
      phoneNumber: validPhone(form.phoneNumber),
      subject: required(form.subject, "Subject"),
      message: required(form.message, "Message"),
    };
    setErrors(found);
    if (hasErrors(found)) {
      setResult({ ok: false, message: "Please fill in all the required fields marked below." });
      return;
    }

    setSending(true);
    try {
      const data = await submitInquiry({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });
      setResult({ ok: true, message: data.message });
      setForm(emptyForm);
      setErrors({});
    } catch (err) {
      setErrors(getFieldErrors(err));
      setResult({ ok: false, message: getErrorMessage(err, "Your message could not be sent. Please try again.") });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left Side */}
        <div className="contact-info">
          <p className="contact-subtitle">REACH OUT</p>
          <h2 className="contact-title">We'd Love to Hear From You</h2>

          <div className="info-item">
            <div className="icon-circle">
              <FaPhoneAlt />
            </div>
            <div>
              <span className="label">PHONE</span>
              <p>+2712(011) 345 6789</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-circle">
              <FaWhatsapp />
            </div>
            <div>
              <span className="label">WHATSAPP</span>
              <p>Chat with us directly</p>
              <p>+27 76 123 4567</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-circle">
              <FaEnvelope />
            </div>
            <div>
              <span className="label">EMAIL</span>
              <p>info@nailbeautysalon.co.za</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-circle">
              <FaMapMarkerAlt />
            </div>
            <div>
              <span className="label">LOCATION</span>
              <p>123 Beauty Avenue, Cape Town, South Africa</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-circle">
              <FaClock />
            </div>
            <div>
              <span className="label">HOURS</span>
              <p>Mon – Fri: 10am – 6pm</p>
              <p>Sat: 8am – 4pm | Sun: Closed</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="contact-form-wrapper">
          <h3>Send a Message</h3>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {result && (
              <p className={`form-message ${result.ok ? "success" : "error"}`} role={result.ok ? "status" : "alert"}>
                {result.message}
              </p>
            )}

            <label htmlFor="fullName">NAME</label>
            <input id="fullName" name="fullName" type="text" placeholder="Your full name" value={form.fullName} onChange={handleChange} />
            <FieldError message={errors.fullName} />

            <label htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            <FieldError message={errors.email} />

            <label htmlFor="phoneNumber">PHONE</label>
            <input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+27 ..." value={form.phoneNumber} onChange={handleChange} />
            <FieldError message={errors.phoneNumber} />

            <label htmlFor="subject">SUBJECT</label>
            <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
              <option value="">Choose a subject</option>
              {SUBJECTS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <FieldError message={errors.subject} />

            <label htmlFor="message">MESSAGE</label>
            <textarea id="message" name="message" rows="6" placeholder="How can we help you?" value={form.message} onChange={handleChange}></textarea>
            <FieldError message={errors.message} />

            <button type="submit" className="submit-btn" disabled={sending}>
              {sending ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;