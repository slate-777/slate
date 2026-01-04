import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <img src="/logo192.png" alt="SLATE Logo" />
                    </div>
                    <ul className="navbar-menu">
                        <li><a href="#home" className="active">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <button className="login-btn" onClick={handleLoginClick}>
                        <i className='bx bx-log-in'></i>
                        Official Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" id="home">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <p className="hero-tagline">If healthy minds and habits matter to you,</p>
                    <h1 className="hero-title">SLATE — THE SCHOOL</h1>
                    <h2 className="hero-subtitle">Document Management System</h2>
                    <p className="hero-description">is the right choice.</p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <h2 className="stats-title">Our Excellence</h2>
                <div className="stats-grid">
                    <div className="stat-box">
                        <h3>15000+</h3>
                        <p>STUDENTS</p>
                    </div>
                    <div className="stat-box">
                        <h3>23</h3>
                        <p>YEARS</p>
                    </div>
                    <div className="stat-box">
                        <h3>8</h3>
                        <p>CAMPUSES</p>
                    </div>
                    <div className="stat-box">
                        <h3>3</h3>
                        <p>CITIES</p>
                    </div>
                    <div className="stat-box">
                        <h3>2</h3>
                        <p>STATES</p>
                    </div>
                    <div className="stat-box">
                        <h3>1</h3>
                        <p>MISSION</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section" id="about">
                <div className="about-container">
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop" alt="Students Learning" />
                    </div>
                    <div className="about-content">
                        <h3 className="about-subtitle">Preparing Students For A</h3>
                        <h2 className="about-title">Dynamic Future</h2>
                        <p>
                            As one of the leading schools in Andhra Pradesh and Hyderabad, Telangana, we believe that the future
                            demands adaptability, creativity, and a strong sense of social responsibility. By focusing on holistic
                            education through our Sampoornatha Program and cutting-edge subjects through SMAART, we prepare students
                            to lead in fields as varied as science, technology, business, and the arts.
                        </p>
                        <p>
                            Our students graduate as lifelong learners, industry-ready professionals, and compassionate global citizens
                            who are equipped to make a positive impact on the world. SLATE Document Management System supports this
                            mission by providing seamless access to educational resources, lab management, and institutional knowledge.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-header">
                    <h2>WE OFFER</h2>
                    <p>Even though we are one of the top schools in Hyderabad, Telangana and Andhra Pradesh, we offer an education that extends beyond conventional boundaries through our comprehensive programs:</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop" alt="Sampoornatha Program" />
                        </div>
                        <h3>The Sampoornatha Program: Holistic Life Skills for Every Age</h3>
                        <p>
                            Our signature Sampoornatha Program is designed to focus on the overall development of each student, nurturing
                            skills that go beyond traditional academics. In an age where artificial intelligence is reshaping industries
                            and societies, we believe it is essential for students to develop a broad set of competencies.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&h=200&fit=crop" alt="SMAART Program" />
                        </div>
                        <h3>SMAART: Cutting-Edge Education for the Future</h3>
                        <p>
                            In today's rapidly evolving world, the future belongs to those who can harness the power of cutting-edge
                            technologies. Our SMAART Program at Slate is designed to equip students with the skills, knowledge, and
                            expertise needed to excel in the most in-demand fields of the 21st century.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop" alt="International Curriculum" />
                        </div>
                        <h3>Unlocking Potential with the International Curriculum</h3>
                        <p>
                            SLATE – The School is one of the best Schools in Hyderabad, Telangana, and Andhra Pradesh. Our International
                            Curriculum offers a rigorous and internationally recognized framework designed to equip students with essential
                            knowledge and skills for success in an ever-evolving world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="video-section">
                <div className="section-header">
                    <h2 className="video-title">Best Schools in Hyderabad, Telangana & Andhra Pradesh</h2>
                    <h3 className="video-subtitle">SLATE – The School: Pioneering Comprehensive Education for a Global Future</h3>
                </div>
                <div className="video-container">
                    <iframe
                        width="100%"
                        height="500"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="SLATE Anthem | Sampoornayaan"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video-description">
                    <p>
                        It's been a remarkable journey, dedicated to making a qualitative difference in the lives of tens of thousands
                        of children and their aspirational parents. Recognised as one of the best Schools in Hyderabad, Telangana, and
                        Andhra Pradesh, SLATE – The School was born from Vasireddy Amarnath's deep reflection on the commercialisation
                        and flaws within the education system, which often lacked values and relevance to both the present and future.
                    </p>
                    <p>
                        Founded in 2001 by Vasireddy Educational Society, SLATE – The School was envisioned as a beacon of quality,
                        value-based education. The school aims to improve ethical standards in education while embracing a forward-looking
                        approach that preserves traditional values and prepares students for a global future.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="section-header">
                    <h2>Get in touch</h2>
                </div>
                <div className="contact-container">
                    <div className="contact-item">
                        <i className='bx bx-phone'></i>
                        <div>
                            <p>+91 9177444173</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <i className='bx bx-envelope'></i>
                        <div>
                            <p>contactus@slateschool.in</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/logo192.png" alt="SLATE Logo" />
                        </div>
                        <p>
                            SLATE - The School is officially affiliated with CBSE, ICSE, and Cambridge boards.
                        </p>
                        <div className="social-links">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#!" aria-label="Facebook"><i className='bx bxl-facebook'></i></a>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#!" aria-label="Instagram"><i className='bx bxl-instagram'></i></a>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#!" aria-label="YouTube"><i className='bx bxl-youtube'></i></a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">About</a></li>
                            <li><a href="#features">Academics</a></li>
                            <li><a href="#about">Admission</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a href="#!">Philosophy</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a href="#!">Gallery</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a href="#!">Reach Us</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a href="#!">Blog</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a href="#!">Careers</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Get in touch</h4>
                        <p>+91 9177444173</p>
                        <p>contactus@slateschool.in</p>
                        <div className="footer-badges">
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/CBSE_logo.svg/200px-CBSE_logo.svg.png" alt="CBSE" />
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Cambridge_Assessment_International_Education_logo.svg/200px-Cambridge_Assessment_International_Education_logo.svg.png" alt="Cambridge" />
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Copyright © 2025 SLATE - The School. Powered by SLATE - The School.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
