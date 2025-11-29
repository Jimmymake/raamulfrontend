// ==========================================
// LANDING PAGE
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.scss';

// Data
const stats = [
  { value: '7,000+', label: 'Acres of Reserves' },
  { value: '160', label: 'Tonnes/Hour Capacity' },
  { value: '10+', label: 'Years Experience' },
  { value: '93%', label: 'Max Purity' },
];

const products = [
  { 
    id: 1, 
    name: 'Gypsum Rock Lumps', 
    purity: '89-93%', 
    desc: 'High-quality natural gypsum for cement & construction', 
    image: 'https://images.cradlevoices.com/uploads/1764428258_375f2f1602.jpg' 
  },
  { 
    id: 2, 
    name: 'Limestone Ore', 
    purity: '85-90%', 
    desc: 'Premium limestone for industrial applications', 
    image: 'https://images.cradlevoices.com/uploads/1764428267_559bd35feb.jpg' 
  },
  { 
    id: 3, 
    name: 'Iron Ore', 
    purity: '60-65%', 
    desc: 'Quality iron ore for steel manufacturing', 
    image: 'https://images.cradlevoices.com/uploads/1764428290_91b632a21a.jpg' 
  },
  { 
    id: 4, 
    name: 'Bauxite Ore', 
    purity: '45-50%', 
    desc: 'Raw bauxite for aluminum production', 
    image: 'https://images.cradlevoices.com/uploads/1764428331_c303abf974.jpg' 
  },
  { 
    id: 5, 
    name: 'Gypsum Powder', 
    purity: '90%+', 
    desc: 'Processed gypsum powder for various uses', 
    image: 'https://images.cradlevoices.com/uploads/1764428343_b749bc8bfa.jpg' 
  },
  { 
    id: 6, 
    name: 'Gypsum Wallboards', 
    purity: 'N/A', 
    desc: 'Construction-ready gypsum boards', 
    image: 'https://images.cradlevoices.com/uploads/1764428357_d19bd46880.jpg' 
  },
];

const services = [
  { icon: '⛏️', title: 'Surface Mining', desc: 'Full-fledged surface/stripping mining operations with modern equipment' },
  { icon: '🔬', title: 'Quality Testing', desc: 'Thorough testing of deposit sites to ensure ore meets industry standards' },
  { icon: '🚛', title: 'Logistics', desc: 'Efficient loading and transportation from our Konza stockpile site' },
  { icon: '📦', title: 'Bulk Supply', desc: 'Large-scale supply for cement factories and construction companies' },
];

const team = [
  { name: 'John Mutuku Mbindyo', role: 'Chairman', initials: 'JM' },
  { name: 'Cosmas Ndeti', role: 'Field Manager', initials: 'CN' },
  { name: 'Simon Mwania', role: 'Operations & Finance Manager', initials: 'SM' },
  { name: 'Joseph Nzioka', role: 'Plant & Mine Manager', initials: 'JN' },
  { name: 'Charles Mwereza', role: 'Human Resources', initials: 'CM' },
  { name: 'Njoki Muthuri', role: 'Business Development', initials: 'NM' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className={`landing__nav ${isScrolled ? 'landing__nav--scrolled' : ''}`}>
        <div className="landing__nav-container">
          <div className="landing__logo">
            <img src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" alt="Raamul Logo" />
            <div className="landing__logo-text">
              <span className="landing__logo-name">RAAMUL</span>
              <span className="landing__logo-sub">INTERNATIONAL</span>
            </div>
          </div>

          <div className="landing__nav-links">
            {['Home', 'About', 'Products', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="landing__nav-link"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="landing__nav-actions">
            <button 
              onClick={() => scrollToSection('products')}
              className="landing__btn landing__btn--outline"
            >
              View Products
            </button>
            <Link to="/auth" className="landing__btn landing__btn--primary">
              Get Started
            </Link>
          </div>

          <button 
            className="landing__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="landing__mobile-menu">
            {['Home', 'About', 'Products', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="landing__mobile-link"
              >
                {item}
              </button>
            ))}
            <Link to="/auth" className="landing__btn landing__btn--primary">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="landing__hero">
        <div className="landing__hero-bg">
          <img src="https://images.cradlevoices.com/uploads/1764428225_4225dc54c1.jpg" alt="Mining" />
        </div>
        <div className="landing__hero-overlay" />
        <div className="landing__hero-glow" />

        <div className="landing__hero-content">
          <div className="landing__hero-badge">
            <span className="landing__hero-badge-dot" />
            <span>Kenya's Leading Mineral Supplier</span>
          </div>

          <h1 className="landing__hero-title">
            Industrial Minerals
            <br />
            <span className="landing__hero-title--accent">Powering Progress</span>
          </h1>

          <p className="landing__hero-desc">
            Surface mining and supply of premium quality gypsum, limestone, iron ore, and bauxite. 
            Serving cement factories and construction industries across East Africa.
          </p>

          <div className="landing__hero-actions">
            <button 
              onClick={() => scrollToSection('products')}
              className="landing__btn landing__btn--primary landing__btn--large"
            >
              Explore Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="landing__btn landing__btn--ghost landing__btn--large"
            >
              Learn More
            </button>
          </div>

          <div className="landing__hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="landing__hero-stat">
                <span className="landing__hero-stat-value">{stat.value}</span>
                <span className="landing__hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing__scroll-indicator">
          <span>Scroll to explore</span>
          <div className="landing__scroll-mouse">
            <div className="landing__scroll-wheel" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing__about">
        <div className="landing__container">
          <div className="landing__about-grid">
            <div className="landing__about-content">
              <span className="landing__section-label">About Us</span>
              <h2 className="landing__section-title">
                Pioneering Surface Mining in Kenya
              </h2>
              <p className="landing__about-text">
                <strong>Raamul International Limited</strong> is principally engaged in surface/stripping mining 
                and trading in gypsum natural rock lumps within the Republic of Kenya.
              </p>
              <p className="landing__about-text">
                Our company has over 7,000 acres of proven gypsum reserves at Konza, Machakos County. 
                The previous operator was the biggest exclusive supplier to LaFarge Bamburi for over 10 years.
              </p>

              <div className="landing__about-cards">
                <div className="landing__about-card landing__about-card--mission">
                  <h4>Our Mission</h4>
                  <p>
                    To strengthen our commitment towards clients, society and the environment while contributing 
                    to the development of industrial building materials.
                  </p>
                </div>
                <div className="landing__about-card landing__about-card--vision">
                  <h4>Our Vision</h4>
                  <p>
                    To be the pioneer surface mining operation and supplier of industrial mineral materials that 
                    transforms resources into modern, environmentally responsible products.
                  </p>
                </div>
              </div>
            </div>

            <div className="landing__about-image">
              <div className="landing__about-image-wrapper">
                <img src="https://images.cradlevoices.com/uploads/1764428343_b749bc8bfa.jpg" alt="Mineral ore" />
                <div className="landing__about-features">
                  {[
                    'ISO Certified Quality',
                    'Environmentally Responsible',
                    'Advanced Technology',
                    '24/7 Operations',
                  ].map((item, i) => (
                    <div key={i} className="landing__about-feature">
                      <div className="landing__about-feature-icon">✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="landing__products">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label">Our Products</span>
            <h2 className="landing__section-title">Industrial Mineral Materials</h2>
            <p className="landing__section-desc">
              Premium quality minerals sourced from our Konza mine for cement factories and construction industries
            </p>
          </div>

          <div className="landing__products-grid">
            {products.map((product) => (
              <div key={product.id} className="landing__product-card">
                <div className="landing__product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="landing__product-badge">Purity: {product.purity}</div>
                </div>
                <div className="landing__product-content">
                  <h3 className="landing__product-name">{product.name}</h3>
                  <p className="landing__product-desc">{product.desc}</p>
                  <div className="landing__product-footer">
                    <button 
                      className="landing__btn landing__btn--primary landing__btn--small"
                      onClick={() => navigate('/auth')}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="landing__products-cta">
            <p>Need bulk quantities or custom specifications?</p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="landing__btn landing__btn--outline"
            >
              Request Custom Quote →
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="landing__services">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label">Our Services</span>
            <h2 className="landing__section-title">End-to-End Mining Solutions</h2>
            <p className="landing__section-desc">
              From extraction to delivery, we handle every aspect of mineral supply
            </p>
          </div>

          <div className="landing__services-grid">
            {services.map((service, i) => (
              <div key={i} className="landing__service-card">
                <div className="landing__service-icon">{service.icon}</div>
                <h3 className="landing__service-title">{service.title}</h3>
                <p className="landing__service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="landing__team">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label">Leadership</span>
            <h2 className="landing__section-title">Senior Management Team</h2>
          </div>

          <div className="landing__team-grid">
            {team.map((member, i) => (
              <div key={i} className="landing__team-card">
                <div className="landing__team-avatar">{member.initials}</div>
                <h4 className="landing__team-name">{member.name}</h4>
                <span className="landing__team-role">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="landing__contact">
        <div className="landing__container">
          <div className="landing__contact-grid">
            <div className="landing__contact-info">
              <span className="landing__section-label">Contact Us</span>
              <h2 className="landing__section-title">Let's Discuss Your Requirements</h2>
              <p className="landing__contact-desc">
                Whether you need bulk mineral supplies or have questions about our products, 
                our team is ready to assist you.
              </p>

              <div className="landing__contact-details">
                <div className="landing__contact-item">
                  <div className="landing__contact-icon">📍</div>
                  <div>
                    <span className="landing__contact-label">Office Address</span>
                    <span className="landing__contact-value">
                      Wuyi Plaza, Block A, Suite A6<br />
                      Galana Road, Kilimani, Nairobi
                    </span>
                  </div>
                </div>
                <div className="landing__contact-item">
                  <div className="landing__contact-icon">📍</div>
                  <div>
                    <span className="landing__contact-label">Stockpile Site</span>
                    <span className="landing__contact-value">Konza, Machakos County</span>
                  </div>
                </div>
                <div className="landing__contact-item">
                  <div className="landing__contact-icon">📞</div>
                  <div>
                    <span className="landing__contact-label">Phone</span>
                    <span className="landing__contact-value">+254 739 567 904</span>
                  </div>
                </div>
                <div className="landing__contact-item">
                  <div className="landing__contact-icon">✉️</div>
                  <div>
                    <span className="landing__contact-label">Email</span>
                    <span className="landing__contact-value">ramulramul2023@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing__contact-form-wrapper">
              <h3>Request a Quote</h3>
              <form className="landing__contact-form">
                <div className="landing__form-row">
                  <input type="text" placeholder="Your Name" />
                  <input type="text" placeholder="Company Name" />
                </div>
                <input type="email" placeholder="Email Address" />
                <input type="tel" placeholder="Phone Number" />
                <select defaultValue="">
                  <option value="" disabled>Select Product</option>
                  <option value="gypsum">Gypsum Rock Lumps</option>
                  <option value="limestone">Limestone Ore</option>
                  <option value="iron">Iron Ore</option>
                  <option value="bauxite">Bauxite Ore</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Your Message / Requirements" rows={4} />
                <button type="submit" className="landing__btn landing__btn--primary">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__container">
          <div className="landing__footer-grid">
            <div className="landing__footer-brand">
              <div className="landing__logo">
                <img src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" alt="Raamul Logo" />
                <div className="landing__logo-text">
                  <span className="landing__logo-name">RAAMUL</span>
                  <span className="landing__logo-sub">INTERNATIONAL LIMITED</span>
                </div>
              </div>
              <p className="landing__footer-desc">
                Kenya's leading supplier of industrial minerals. Surface mining and trading in gypsum, 
                limestone, iron ore, and bauxite.
              </p>
              <p className="landing__footer-quote">
                "We must ensure that sustainable company development is financially sustainable"
              </p>
            </div>

            <div className="landing__footer-links">
              <h4>Quick Links</h4>
              {['Home', 'About Us', 'Products', 'Services', 'Contact'].map((link, i) => (
                <button key={i} onClick={() => scrollToSection(link.toLowerCase().replace(' ', ''))}>
                  {link}
                </button>
              ))}
            </div>

            <div className="landing__footer-links">
              <h4>Products</h4>
              {['Gypsum Ore', 'Limestone Ore', 'Iron Ore', 'Bauxite Ore', 'Gypsum Powder'].map((link, i) => (
                <button key={i} onClick={() => scrollToSection('products')}>
                  {link}
                </button>
              ))}
            </div>

            <div className="landing__footer-links">
              <h4>Contact</h4>
              <span>📍 Wuyi Plaza, Galana Road</span>
              <span>📍 Kilimani, Nairobi</span>
              <span>📞 +254 739 567 904</span>
              <span>✉️ ramulramul2023@gmail.com</span>
            </div>
          </div>

          <div className="landing__footer-bottom">
            <p>© 2024 Raamul International Limited. All rights reserved.</p>
            <p>P.O. Box 10971 – 00100, Nairobi, Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

