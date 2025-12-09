// ==========================================
// ABOUT PAGE - Company Information
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../../../components/common';
import './AboutPage.scss';

const AboutPage = () => {
  const stats = [
    { value: '10K+', label: 'Products' },
    { value: '5K+', label: 'Happy Customers' },
    { value: '50+', label: 'Suppliers' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Quality First',
      description: 'We source only the best products from trusted suppliers, ensuring every item meets our high standards.'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'Building lasting relationships through honest communication and fair business practices.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously improving our platform to provide the best B2B e-commerce experience.'
    },
    {
      icon: '💚',
      title: 'Sustainability',
      description: 'Committed to environmentally responsible sourcing and packaging practices.'
    }
  ];

  const team = [
    { name: 'Ahmed Hassan', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
    { name: 'Sarah Wanjiku', role: 'Operations Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
    { name: 'James Ochieng', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
    { name: 'Grace Muthoni', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' }
  ];

  return (
    <div className="about-page">
      <Navbar />

      <main className="about-page__main">
        {/* Hero Section */}
        <section className="about-page__hero">
          <div className="about-page__hero-bg">
            <div className="about-page__hero-shape about-page__hero-shape--1" />
            <div className="about-page__hero-shape about-page__hero-shape--2" />
          </div>
          <div className="about-page__container">
            <span className="about-page__label">About Us</span>
            <h1 className="about-page__title">
              Empowering Businesses Across <span>East Africa</span>
            </h1>
            <p className="about-page__subtitle">
              Raamul International is Kenya's leading B2B e-commerce platform, 
              connecting businesses with quality products and reliable suppliers since 2020.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-page__stats">
          <div className="about-page__container">
            <div className="about-page__stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="about-page__stat">
                  <span className="about-page__stat-value">{stat.value}</span>
                  <span className="about-page__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-page__story">
          <div className="about-page__container">
            <div className="about-page__story-grid">
              <div className="about-page__story-content">
                <span className="about-page__label">Our Story</span>
                <h2>From Small Beginnings to Industry Leader</h2>
                <p>
                  Founded in 2020, Raamul International started with a simple mission: 
                  to make wholesale purchasing easier for businesses in Kenya. What began 
                  as a small operation has grown into East Africa's most trusted B2B marketplace.
                </p>
                <p>
                  Today, we serve thousands of businesses across multiple industries, 
                  from retail shops to large enterprises. Our platform connects buyers 
                  with verified suppliers, ensuring quality products at competitive prices.
                </p>
                <p>
                  With integrated M-Pesa payments and reliable logistics, we've 
                  streamlined the entire procurement process, saving our customers 
                  time and money.
                </p>
              </div>
              <div className="about-page__story-image">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=500&fit=crop" 
                  alt="Team collaboration"
                />
                <div className="about-page__story-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-page__values">
          <div className="about-page__container">
            <div className="about-page__section-header">
              <span className="about-page__label">Our Values</span>
              <h2>What Drives Us Forward</h2>
            </div>
            <div className="about-page__values-grid">
              {values.map((value, index) => (
                <div key={index} className="about-page__value-card">
                  <span className="about-page__value-icon">{value.icon}</span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-page__team">
          <div className="about-page__container">
            <div className="about-page__section-header">
              <span className="about-page__label">Our Team</span>
              <h2>Meet the People Behind Raamul</h2>
            </div>
            <div className="about-page__team-grid">
              {team.map((member, index) => (
                <div key={index} className="about-page__team-card">
                  <div className="about-page__team-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-page__cta">
          <div className="about-page__container">
            <div className="about-page__cta-content">
              <h2>Ready to Grow Your Business?</h2>
              <p>Join thousands of businesses already using Raamul International</p>
              <div className="about-page__cta-buttons">
                <Link to="/auth" className="about-page__btn about-page__btn--primary">
                  Get Started Free
                </Link>
                <Link to="/contact" className="about-page__btn about-page__btn--outline">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;










