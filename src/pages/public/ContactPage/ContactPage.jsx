// ==========================================
// CONTACT PAGE - Get in Touch
// ==========================================

import React, { useState } from 'react';
import { Navbar, Footer, LoadingSpinner } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import './ContactPage.scss';

const ContactPage = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['Westlands Business Park', 'Nairobi, Kenya']
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+254 700 123 456', '+254 733 456 789']
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['info@raamul.co.ke', 'sales@raamul.co.ke']
    },
    {
      icon: '🕐',
      title: 'Working Hours',
      details: ['Mon - Fri: 8AM - 6PM', 'Sat: 9AM - 2PM']
    }
  ];

  const faqs = [
    {
      question: 'What is the minimum order quantity?',
      answer: 'Minimum order quantities vary by product and supplier. Most products have a MOQ starting from 10 units.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery within Nairobi takes 1-3 business days. Nationwide delivery takes 3-7 business days.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, bank transfers, and major credit/debit cards. Business accounts can also apply for credit terms.'
    },
    {
      question: 'Can I return products?',
      answer: 'Yes, we have a 30-day return policy for defective or damaged items. Custom orders are non-returnable.'
    }
  ];

  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-page__main">
        {/* Hero Section */}
        <section className="contact-page__hero">
          <div className="contact-page__hero-bg">
            <div className="contact-page__hero-shape contact-page__hero-shape--1" />
            <div className="contact-page__hero-shape contact-page__hero-shape--2" />
          </div>
          <div className="contact-page__container">
            <span className="contact-page__label">Contact Us</span>
            <h1 className="contact-page__title">
              Let's Start a <span>Conversation</span>
            </h1>
            <p className="contact-page__subtitle">
              Have questions? We'd love to hear from you. Send us a message 
              and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-page__info">
          <div className="contact-page__container">
            <div className="contact-page__info-grid">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-page__info-card">
                  <span className="contact-page__info-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  {item.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="contact-page__form-section">
          <div className="contact-page__container">
            <div className="contact-page__form-grid">
              {/* Form */}
              <div className="contact-page__form-wrapper">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>

                <form className="contact-page__form" onSubmit={handleSubmit}>
                  <div className="contact-page__form-row">
                    <div className="contact-page__form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="contact-page__form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-page__form-row">
                    <div className="contact-page__form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div className="contact-page__form-group">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company Ltd"
                      />
                    </div>
                  </div>

                  <div className="contact-page__form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div className="contact-page__form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows="5"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="contact-page__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="small" />
                        Sending...
                      </>
                    ) : (
                      <>
                        📨 Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map Placeholder */}
              <div className="contact-page__map">
                <div className="contact-page__map-placeholder">
                  <span className="contact-page__map-icon">🗺️</span>
                  <h3>Find Us</h3>
                  <p>Westlands Business Park<br />Nairobi, Kenya</p>
                  <a 
                    href="https://maps.google.com/?q=Westlands+Nairobi+Kenya" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-page__map-link"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-page__faq">
          <div className="contact-page__container">
            <div className="contact-page__section-header">
              <span className="contact-page__label">FAQ</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="contact-page__faq-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="contact-page__faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;

