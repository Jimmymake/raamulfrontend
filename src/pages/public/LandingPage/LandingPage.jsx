// ==========================================
// LANDING PAGE
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LazyImage, ProductImage } from '../../../components/common';
import './LandingPage.scss';

// Data
const stats = [
  { value: '7,000+', label: 'Acres of Reserves' },
  { value: '160', label: 'Tonnes/Hour Capacity' },
  { value: '10+', label: 'Years Experience' },
  { value: '93%', label: 'Max Purity' },
];

// Hero carousel images
const heroImages = [
  {
    id: 1,
    src: 'https://images.cradlevoices.com/uploads/1765544357_604be7b147.jpg',
    alt: 'Mining Operations'
  },
  {
    id: 2,
    src: 'https://images.cradlevoices.com/uploads/1765544418_87709c2779.jpg',
    alt: 'Mineral Stockpile'
  },

  {
    id: 3,
    src: 'https://images.cradlevoices.com/uploads/1765544447_5c5508a818.jpg',
    alt: 'Surface Mining'
  },

];

// Product images - upload PNG files to https://images.cradlevoices.com and update URLs here
const products = [
  {
    id: 1,
    name: 'Bentonite Food Grade',
    weight: '50KGS',
    desc: 'A highly purified, safe natural clay used in the food and beverage industry. It removes impurities, clarifies juices and oils, binds toxins, and supports digestive health. Ideal for beverage filtration, food processing, and detox applications.',
    image: 'https://images.cradlevoices.com/uploads/1765546007_4f5ae66043.png',
    gallery: [
      'https://images.cradlevoices.com/uploads/1765546007_4f5ae66043.png',
      'https://images.cradlevoices.com/uploads/1765541549_1666963c41.png',
    ],
    badge: 'Food Grade'
  },
  {
    id: 2,
    name: 'Gypsum Agri',
    weight: '50KGS',
    desc: 'A natural soil conditioner that improves soil structure, enhances water infiltration, reduces compaction, and supplies essential calcium and sulfur to support healthier, stronger crops. Ideal for restoring depleted or hard soils.',
    image: 'https://images.cradlevoices.com/uploads/1765545940_5e549ecc50.png',
    gallery: [
      'https://images.cradlevoices.com/uploads/1765545940_5e549ecc50.png',
      'https://images.cradlevoices.com/uploads/1765541507_f9ebe99200.png',
    ],
    badge: 'Industrial'
  },
  {
    id: 3,
    name: 'Lime Agri',
    weight: '50KGS',
    desc: 'A soil amendment used to reduce soil acidity, improve pH balance, and increase nutrient availability. It boosts soil health, enhances fertilizer efficiency, and supports stronger crop growth.',
    image: 'https://images.cradlevoices.com/uploads/1765545973_f03f95d1ab.png',
    gallery: [
      'https://images.cradlevoices.com/uploads/1765545973_f03f95d1ab.png',
      'https://images.cradlevoices.com/uploads/1765541585_df2adf8a9c.png',
    ],
    badge: '89-93% Purity'
  },
  // { 
  //   id: 4, 
  //   name: 'Limestone & Dolomite (Industrial & Construction Grade)', 
  //   weight: '50KGS', 
  //   desc: 'Strong, durable minerals used in cement, steel, glass, road construction, and aggregates for major building and infrastructure projects.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '90%+ Purity'
  // },
  // { 
  //   id: 5, 
  //   name: 'Raw Gypsum for Cement', 
  //   weight: 'Bulk', 
  //   desc: 'Natural gypsum used as a setting regulator in cement to control hardening time and improve workability.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '85-90% Purity'
  // },
  // { 
  //   id: 6, 
  //   name: 'Powdered Gypsum for Food Industry', 
  //   weight: 'Bulk', 
  //   desc: 'A safe additive that improves dough strength, aids fermentation, supports cheese and tofu production, and stabilizes food texture.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '60-65% Fe'
  // },
  //  { 
  //   id: 7, 
  //   name: 'Pozzolana', 
  //   weight: 'Bulk', 
  //   desc: 'A volcanic or industrial material that reacts with lime to strengthen concrete, making it durable, economical, and ideal for marine or heavy structures.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '60-65% Fe'
  // },
  //    { 
  //   id: 8, 
  //   name: 'Kankar', 
  //   weight: 'Bulk', 
  //   desc: 'A naturally occurring calcareous material used for road sub-bases, soil improvement, lime production, drainage, and rural construction.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '60-65% Fe'
  // },
  //    { 
  //   id: 9, 
  //   name: 'Biochar & Smokeless Briquettes', 
  //   weight: 'Bulk', 
  //   desc: 'Eco-friendly carbon products that improve soil health, filter water, store carbon, and provide clean-burning fuel for cooking or industry.', 
  //   image: 'src/images/productimages/Gypsum.png',
  //   badge: '60-65% Fe'
  // },
];


// Service icons as SVG components
const ServiceIcons = {
  mining: (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Excavator/Bulldozer */}
      <rect x="2" y="12" width="14" height="6" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="2" y="12" width="14" height="6" rx="1" stroke="currentColor" />
      <rect x="4" y="14" width="10" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
      {/* Bucket/Arm */}
      <path d="M16 14l4-2v4l-4 2v-4z" fill="currentColor" opacity="0.2" />
      <path d="M16 14l4-2v4l-4 2v-4z" stroke="currentColor" />
      {/* Wheels */}
      <circle cx="6" cy="18" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="6" cy="18" r="2" stroke="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="12" cy="18" r="2" stroke="currentColor" />
      {/* Ground/Mining */}
      <path d="M2 18h20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M3 20h4M9 20h4M15 20h4" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  testing: (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Microscope */}
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 21v-4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 17h8" stroke="currentColor" strokeWidth="2" />
      {/* Stand */}
      <path d="M10 13l-2-2a3 3 0 0 1 0-4.24l2-2" stroke="currentColor" />
      <path d="M14 13l2-2a3 3 0 0 0 0-4.24l-2-2" stroke="currentColor" />
      {/* Lens */}
      <circle cx="12" cy="7" r="3" fill="currentColor" opacity="0.1" />
      <circle cx="12" cy="7" r="3" stroke="currentColor" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" opacity="0.3" />
      {/* Test tube */}
      <rect x="18" y="4" width="2" height="6" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="18" y="4" width="2" height="6" rx="1" stroke="currentColor" />
      <path d="M19 6h0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  logistics: (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Truck body */}
      <rect x="2" y="8" width="16" height="8" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="2" y="8" width="16" height="8" rx="1" stroke="currentColor" />
      {/* Truck cabin */}
      <rect x="2" y="8" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.2" />
      <rect x="2" y="8" width="6" height="6" rx="0.5" stroke="currentColor" />
      {/* Windows */}
      <rect x="3" y="9.5" width="4" height="2" rx="0.3" fill="currentColor" opacity="0.3" />
      {/* Cargo area */}
      <rect x="8" y="9" width="8" height="6" rx="0.5" fill="currentColor" opacity="0.1" />
      <rect x="8" y="9" width="8" height="6" rx="0.5" stroke="currentColor" />
      {/* Cargo lines */}
      <path d="M10 11h4M10 13h4M10 15h4" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      {/* Wheels */}
      <circle cx="6" cy="18" r="2.5" fill="currentColor" opacity="0.2" />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" />
      <circle cx="6" cy="18" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="14" cy="18" r="2.5" fill="currentColor" opacity="0.2" />
      <circle cx="14" cy="18" r="2.5" stroke="currentColor" />
      <circle cx="14" cy="18" r="1.2" fill="currentColor" opacity="0.4" />
      {/* Road */}
      <path d="M1 20h22" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    </svg>
  ),
  supply: (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Stacked boxes/crates */}
      <rect x="4" y="12" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="4" y="12" width="8" height="8" rx="1" stroke="currentColor" />
      <path d="M6 14h4M6 16h4M6 18h4" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      <rect x="12" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="12" y="8" width="8" height="8" rx="1" stroke="currentColor" />
      <path d="M14 10h4M14 12h4M14 14h4" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* Arrow/flow indicator */}
      <path d="M8 10l2-2 2 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" />
      {/* Warehouse building */}
      <rect x="2" y="20" width="20" height="2" fill="currentColor" opacity="0.3" />
      <path d="M7 20v-8M17 20v-8" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
};

const services = [
  { icon: ServiceIcons.mining, title: 'Surface Mining', desc: 'Full-fledged surface/stripping mining operations with modern equipment' },
  { icon: ServiceIcons.testing, title: 'Quality Testing', desc: 'Thorough testing of deposit sites to ensure ore meets industry standards' },
  { icon: ServiceIcons.logistics, title: 'Logistics', desc: 'Efficient loading and transportation from our Konza stockpile site' },
  { icon: ServiceIcons.supply, title: 'Bulk Supply', desc: 'Large-scale supply for cement factories and construction companies' },
];

// Gallery images - add your mining/facility/product images here
const galleryImages = [
  {
    id: 1,
    src: 'https://images.cradlevoices.com/uploads/1765285809_2fd0f13497.png',
    title: 'Mining Operations',
    category: 'Operations'
  },
  {
    id: 2,
    src: 'https://images.cradlevoices.com/uploads/1765286350_adce59b928.png',
    title: 'Mineral Stockpile',
    category: 'Facilities'
  },
  {
    id: 3,
    src: 'https://images.cradlevoices.com/uploads/1765560599_e7985f263c.jpeg',
    title: 'Product Packaging',
    category: 'Products'
  },
  {
    id: 4,
    src: 'https://images.cradlevoices.com/uploads/1765113635_d49d51c780.jpeg',
    title: 'Surface Mining',
    category: 'Operations'
  },
  // {
  //   id: 5,
  //   src: 'https://images.cradlevoices.com/uploads/1765113699_1e3e8e26bc.jpeg',
  //   title: 'Quality Control',
  //   category: 'Operations'
  // },

  {
    id: 6,
    src: 'https://images.cradlevoices.com/uploads/1765561873_3e475e96e5.jpg',
    title: 'Transportation',
    category: 'Logistics'
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState(() =>
    products.reduce((acc, product) => {
      acc[product.id] = product.image;
      return acc;
    }, {})
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero carousel auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000); // Change slide every 1 second

    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll animation effect - side by side popping
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add delay based on index for staggered effect
          setTimeout(() => {
            entry.target.classList.add('scroll-reveal--visible');
          }, index * 200); // 200ms delay between each element
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    elements.forEach((el) => observer.observe(el));

    // Trigger animations for elements already visible (navbar, hero)
    setTimeout(() => {
      const visibleElements = document.querySelectorAll('.landing__nav .scroll-reveal, .landing__nav .scroll-reveal-left, .landing__nav .scroll-reveal-right, .landing__hero .scroll-reveal, .landing__hero .scroll-reveal-left, .landing__hero .scroll-reveal-right');
      visibleElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('scroll-reveal--visible');
        }, index * 150);
      });
    }, 200);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Re-trigger gallery animations when category changes
  useEffect(() => {
    // Wait for DOM to update with filtered items
    setTimeout(() => {
      const galleryItems = document.querySelectorAll('.landing__gallery-item');
      
      // Remove visible class from all gallery items first
      galleryItems.forEach((el) => {
        el.classList.remove('scroll-reveal--visible');
      });

      // Re-add visible class to currently visible gallery items with animation
      galleryItems.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('scroll-reveal--visible');
        }, index * 100);
      });
    }, 50);
  }, [selectedCategory]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleProductThumbSelect = (productId, imageSrc) => {
    setSelectedProductImages((prev) => ({
      ...prev,
      [productId]: imageSrc,
    }));
  };

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className={`landing__nav ${isScrolled ? 'landing__nav--scrolled' : ''}`}>
        <div className="landing__nav-container">
          <div className="landing__logo scroll-reveal-left">
            <img src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" alt="Raamul Logo" />
            <div className="landing__logo-text">
              <span className="landing__logo-name">RAAMUL</span>
              <span className="landing__logo-sub">INTERNATIONAL</span>
            </div>
          </div>

          <div className="landing__nav-links">
            {['Home', 'About', 'Products', 'Services', 'Gallery', 'Contact'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`landing__nav-link scroll-reveal ${index % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="landing__nav-actions scroll-reveal-right">
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
            {['Home', 'About', 'Products', 'Services', 'Gallery', 'Contact'].map((item) => (
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

      {/* Hero Carousel Section */}
      <section
        className="landing__hero-carousel-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="landing__hero-carousel"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className="landing__hero-slide"
            >
              <div className="landing__hero-bg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="landing__hero-img"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="landing__hero-nav landing__hero-nav--prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className="landing__hero-nav landing__hero-nav--next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="landing__hero-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`landing__hero-dot ${index === currentSlide ? 'landing__hero-dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="landing__hero-overlay" />
        <div className="landing__hero-glow" />
      </section>

      {/* Hero Content Section */}
      <section id="home" className="landing__hero-content-section">
        <div className="landing__container">
          <div className="landing__hero-content">
            <div className="landing__hero-badge scroll-reveal-left">
              <span className="landing__hero-badge-dot" />
              <span>Kenya's Leading Mineral Supplier</span>
            </div>

            <h1 className="landing__hero-title scroll-reveal-right">
              Industrial Minerals
              <br />
              <span className="landing__hero-title--accent">Powering Progress</span>
            </h1>

            <p className="landing__hero-desc scroll-reveal-left">
              Transforming agriculture, construction, and industry with high-quality, earth-derived products built for performance and long-term impact.
            </p>

            <div className="landing__hero-actions">
              <button
                onClick={() => scrollToSection('products')}
                className="landing__btn landing__btn--primary landing__btn--large scroll-reveal-left"
              >
                Explore Products
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="landing__btn landing__btn--ghost landing__btn--large scroll-reveal-right"
              >
                Learn More
              </button>
            </div>

            <div className="landing__hero-stats scroll-reveal">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`landing__hero-stat ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                >
                  <span className="landing__hero-stat-value">{stat.value}</span>
                  <span className="landing__hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing__about scroll-reveal">
        <div className="landing__container">
          <div className="landing__about-grid">
            <div className="landing__about-content scroll-reveal-left">
              <span className="landing__section-label scroll-reveal-left">About Us</span>
              <h2 className="landing__section-title scroll-reveal-left">
                About Raamul
              </h2>
              <p className="landing__about-text scroll-reveal-left">
                <strong>Raamul International Limited</strong> is a construction, vegetation & industrial minerals mining, processing & trading company. Based in Machakos County, Kenya, with a global supply chain reach. We practice sustainable mining, reclamation & responsibly source raw materials from like-minded producers. Our operations are carbon neutral.
              </p>
              <p className="landing__about-text scroll-reveal-left">
                Our passion for innovating all-natural material products gives our clients holistic pure production & improves lives.
              </p>

              <div className="landing__about-cards">
                <div className={`landing__about-card landing__about-card--mission scroll-reveal-left`}>
                  <h4>Our Mission</h4>
                  <p>
                    To strengthen our commitment towards clients, society and the environment while contributing 
                    to the development of industrial building materials.
                  </p>
                </div>
                <div className={`landing__about-card landing__about-card--vision scroll-reveal-right`}>
                  <h4>Our Vision</h4>
                  <p>
                    To restore and enrich soils across Africa through natural, science-backed mineral solutions—empowering farmers, industries, and communities with sustainable products that protect the earth and nourish life.
                  </p>
                </div>
              </div>
            </div>

            <div className="landing__about-image scroll-reveal-right">
              {/* <div className="landing__about-image-wrapper">
                <LazyImage
                  src="src/images/Screencast from 2025-12-08 15-40-43.mp4"
                  alt="Mineral ore"
                  aspectRatio="4/3"
                  className="landing__about-img"
                />
                <div className="landing__about-features">
                  {[
                    'ISO Certified Quality',
                    'Environmentally Responsible',
                    'Advanced Technology',
                    '24/7 Operations',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`landing__about-feature ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                    >
                      <div className="landing__about-feature-icon">✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div> */}

              <div className="landing__about-cards">
                <div className={`landing__about-card landing__about-card--mission scroll-reveal-left`}>
                  <h4>Products & Minerals</h4>
                  <p>
                    <strong>Minerals:</strong> Gypsum, Limestone, Dolomite, Bentonite clay, Silica, Pozzolana, Kankar, Copper ore, Magnesium, Manganese, Bauxite, Silver, Cement premix, Gold, Fertilizer & soil conditioners.
                  </p>
                  <p>
                    We sell pure or mix Gypsum, Lime, biochar, dolomite, bentonite & added minerals.
                  </p>
                  <p>
                    <strong>Acacia weed based biochar</strong> (carbon capture) & smokeless briquettes for industrial purposes & steam energy boilers.
                  </p>
                </div>
                <div className={`landing__about-card landing__about-card--vision scroll-reveal-right`}>
                  <h4>Industries Served</h4>
                  <ul>
                    <li>Adhesives & Sealants</li>
                    <li>Agricultural mineral fertilizers & soil conditioners</li>
                    <li>Animal feeds</li>
                    <li>Plant nutrition - our solutions help to increase yield & ensure long-term plant health</li>
                    <li>Air & water treatments with bentonite clay & bamboo granules</li>
                    <li>Food industry & pharma</li>
                    <li>Food grade minerals & coloring serving the critical human industrial needs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="landing__products scroll-reveal">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label scroll-reveal-left">Our Products</span>
            <h2 className="landing__section-title scroll-reveal-right">Industrial Mineral Materials</h2>
            <p className="landing__section-desc scroll-reveal-left">
              Premium quality minerals sourced from our Konza mine for cement factories and construction industries
            </p>
          </div>

          <div className="landing__products-grid">
            {products.map((product, index) => {
              const galleryImages = product.gallery?.length ? product.gallery : [product.image];
              const activeImage = selectedProductImages[product.id] || galleryImages[0];

              return (
                <div
                  key={product.id}
                  className={`landing__product-card ${index % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                >
                  <div className="landing__product-badge">{product.badge}</div>
                  <div className="landing__product-image">
                    <ProductImage
                      src={activeImage}
                      alt={product.name}
                      size="medium"
                      className="landing__product-img"
                    />

                    <div className="landing__product-thumbs">
                      {galleryImages.slice(0, 3).map((thumbSrc, i) => (
                        <button
                          key={thumbSrc + i}
                          className={`landing__product-thumb ${activeImage === thumbSrc ? 'is-active' : ''}`}
                          onClick={() => handleProductThumbSelect(product.id, thumbSrc)}
                          aria-label={`View ${product.name} image ${i + 1}`}
                          type="button"
                        >
                          <img src={thumbSrc} alt={`${product.name} thumbnail ${i + 1}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="landing__product-content">
                    <h3 className="landing__product-name">{product.name}</h3>
                    <p className="landing__product-desc">{product.desc}</p>
                    <div className="landing__product-meta">
                      <span className="landing__product-weight">📦 {product.weight}</span>
                    </div>
                    <div className="landing__product-footer">
                      <button
                        className="landing__btn landing__btn--primary landing__btn--small"
                        onClick={() => navigate('/auth')}
                      >
                        Shop Now
                      </button>
                      {/* <button 
                        className="landing__btn landing__btn--outline landing__btn--small"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        More
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="landing__products-cta scroll-reveal-right">
            <p className="scroll-reveal-left">Need bulk quantities or custom specifications?</p>
            <button
              onClick={() => scrollToSection('contact')}
              className="landing__btn landing__btn--outline scroll-reveal-right"
            >
              Request Custom Quote →
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="landing__services scroll-reveal">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label scroll-reveal-left">Our Services</span>
            <h2 className="landing__section-title scroll-reveal-right">End-to-End Mining Solutions</h2>
            <p className="landing__section-desc scroll-reveal-left">
              From extraction to delivery, we handle every aspect of mineral supply
            </p>
          </div>

          <div className="landing__services-grid">
            {services.map((service, i) => (
              <div
                key={i}
                className={`landing__service-card ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
              >
                <div className="landing__service-icon">{service.icon}</div>
                <h3 className="landing__service-title">{service.title}</h3>
                <p className="landing__service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="landing__gallery scroll-reveal">
        <div className="landing__container">
          <div className="landing__section-header">
            <span className="landing__section-label scroll-reveal-left">Gallery</span>
            <h2 className="landing__section-title scroll-reveal-right">Our Operations & Facilities</h2>
            <p className="landing__section-desc scroll-reveal-left">
              Explore our mining operations, facilities, and quality products
            </p>
          </div>

          {/* Gallery Filters */}
          <div className="landing__gallery-filters">
            {['All', 'Operations', 'Facilities', 'Products', 'Logistics'].map((category, index) => (
              <button
                key={category}
                className={`landing__gallery-filter scroll-reveal ${index % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'} ${selectedCategory === category ? 'landing__gallery-filter--active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="landing__gallery-grid">
            {galleryImages
              .filter(img => selectedCategory === 'All' || img.category === selectedCategory)
              .map((image, index) => (
                <div
                  key={image.id}
                  className={`landing__gallery-item ${index % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="landing__gallery-image-wrapper">
                    <LazyImage
                      src={image.src}
                      alt={image.title}
                      aspectRatio="4/3"
                      className="landing__gallery-img"
                    />
                    <div className="landing__gallery-overlay">
                      <div className="landing__gallery-content">
                        <h4 className="landing__gallery-title">{image.title}</h4>
                        <span className="landing__gallery-category">{image.category}</span>
                        <div className="landing__gallery-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="landing__gallery-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div className="landing__gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="landing__gallery-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <LazyImage
              src={selectedImage.src}
              alt={selectedImage.title}
              aspectRatio="16/9"
              className="landing__gallery-modal-img"
            />
            <div className="landing__gallery-modal-info">
              <h3>{selectedImage.title}</h3>
              <span>{selectedImage.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="landing__contact scroll-reveal">
        <div className="landing__container">
          <div className="landing__contact-grid">
            <div className="landing__contact-info scroll-reveal-left">
              <span className="landing__section-label scroll-reveal-left">Contact Us</span>
              <h2 className="landing__section-title scroll-reveal-left">Let's Discuss Your Requirements</h2>
              <p className="landing__contact-desc scroll-reveal-left">
                Whether you need bulk mineral supplies or have questions about our products,
                our team is ready to assist you.
              </p>

              <div className="landing__contact-details">
                <div className={`landing__contact-item scroll-reveal-left`}>
                  <div className="landing__contact-icon">📍</div>
                  <div>
                    <span className="landing__contact-label">Office Address</span>
                    <span className="landing__contact-value">
                      Wuyi Plaza, Block A, Suite A6<br />
                      Galana Road, Kilimani, Nairobi
                    </span>
                  </div>
                </div>
                <div className={`landing__contact-item scroll-reveal-right`}>
                  <div className="landing__contact-icon">📍</div>
                  <div>
                    <span className="landing__contact-label">Stockpile Site</span>
                    <span className="landing__contact-value">Konza, Machakos County</span>
                  </div>
                </div>
                <div className={`landing__contact-item scroll-reveal-left`}>
                  <div className="landing__contact-icon">📞</div>
                  <div>
                    <span className="landing__contact-label">Phone</span>
                    <span className="landing__contact-value">+254 739 567 904</span>
                  </div>
                </div>
                <div className={`landing__contact-item scroll-reveal-right`}>
                  <div className="landing__contact-icon">✉️</div>
                  <div>
                    <span className="landing__contact-label">Email</span>
                    <span className="landing__contact-value">ramulramul2023@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing__contact-form-wrapper scroll-reveal-right">
              <h3 className="scroll-reveal-right">Request a Quote</h3>
              <form className="landing__contact-form">
                <div className="landing__form-row">
                  <input type="text" placeholder="Your Name" className="scroll-reveal-left" />
                  <input type="text" placeholder="Company Name" className="scroll-reveal-right" />
                </div>
                <input type="email" placeholder="Email Address" className="scroll-reveal-left" />
                <input type="tel" placeholder="Phone Number" className="scroll-reveal-right" />
                <select defaultValue="" className="scroll-reveal-left">
                  <option value="" disabled>Select Product</option>
                  <option value="gypsum">Gypsum Rock Lumps</option>
                  <option value="limestone">Limestone Ore</option>
                  <option value="iron">Iron Ore</option>
                  <option value="bauxite">Bauxite Ore</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Your Message / Requirements" rows={4} className="scroll-reveal-right" />
                <button type="submit" className="landing__btn landing__btn--primary scroll-reveal-left">
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
            <div className="landing__footer-brand scroll-reveal-left">
              <div className="landing__logo scroll-reveal-left">
                <img src="https://images.cradlevoices.com/uploads/1764428213_6639a919f8.png" alt="Raamul Logo" />
                <div className="landing__logo-text">
                  <span className="landing__logo-name">RAAMUL</span>
                  <span className="landing__logo-sub">INTERNATIONAL LIMITED</span>
                </div>
              </div>
              <p className="landing__footer-desc scroll-reveal-left">
                Kenya's leading supplier of industrial minerals. Surface mining and trading in gypsum,
                limestone, iron ore, and bauxite.
              </p>
              <p className="landing__footer-quote scroll-reveal-left">
                "We must ensure that sustainable company development is financially sustainable"
              </p>
            </div>

            <div className="landing__footer-links scroll-reveal">
              <h4 className="scroll-reveal-left">Quick Links</h4>
              {['Home', 'About Us', 'Products', 'Services', 'Gallery', 'Contact'].map((link, i) => (
                <button
                  key={i}
                  className={`scroll-reveal ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                  onClick={() => scrollToSection(link.toLowerCase().replace(' ', ''))}
                >
                  {link}
                </button>
              ))}
            </div>

            <div className="landing__footer-links scroll-reveal">
              <h4 className="scroll-reveal-right">Products</h4>
              {['Gypsum Ore', 'Limestone Ore', 'Iron Ore', 'Bauxite Ore', 'Gypsum Powder'].map((link, i) => (
                <button
                  key={i}
                  className={`scroll-reveal ${i % 2 === 0 ? 'scroll-reveal-left' : 'scroll-reveal-right'}`}
                  onClick={() => scrollToSection('products')}
                >
                  {link}
                </button>
              ))}
            </div>

            <div className="landing__footer-links scroll-reveal-right">
              <h4 className="scroll-reveal-right">Contact</h4>
              <span className="scroll-reveal-right">📍 Wuyi Plaza, Galana Road</span>
              <span className="scroll-reveal-right">📍 Kilimani, Nairobi</span>
              <span className="scroll-reveal-right">📞 +254 739 567 904</span>
              <span className="scroll-reveal-right">✉️ ramulramul2023@gmail.com</span>
            </div>
          </div>

          <div className="landing__footer-bottom">
            <p className="scroll-reveal-left">© 2024 Raamul International Limited. All rights reserved.</p>
            <p className="scroll-reveal-right">P.O. Box 10971 – 00100, Nairobi, Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

