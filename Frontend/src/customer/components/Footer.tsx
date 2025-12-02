import React from 'react'
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-dark text-light pt-5 pb-3" style={{ marginTop: 'auto', flexShrink: 0, width: '100%' }}>
        <div className="container">
          {/* ===== Top Section ===== */}
          <div
            className="row gy-5 gy-md-4 gx-0 gx-md-4 gx-lg-5 text-center text-md-start justify-content-center"
          >
            {/* Logo & About */}
            <div className="col-12 col-sm-10 col-md-6 col-lg-3 px-3">
              <img
                src="/assets/images/Logo.png"
                alt="Logo"
                className="mb-3 mx-auto mx-md-0 d-block"
                style={{ width: '180px', height: '50px', objectFit: 'contain' }}
              />
              <p className="small mb-3 text-center text-md-start">
                Experience culinary excellence with our diverse and flavorful menu,
                crafted to offer the perfect blend of taste, quality, and creativity.
              </p>
              <div
                className="social-icons"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: "20px",
                  gap: "10px",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: "#ffffff",
                    fontSize: "22px",
                    transition: "transform 0.3s ease, color 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FF6A00";
                    e.currentTarget.style.transform = "scale(1.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <FaFacebook />
                </a>

                <a
                  href="#"
                  style={{
                    color: "#ffffff",
                    fontSize: "22px",
                    transition: "transform 0.3s ease, color 0.3s ease",
                    textDecoration: "none",
                    alignItems: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FF6A00";
                    e.currentTarget.style.transform = "scale(1.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-sm-5 col-md-4 col-lg-2 px-3">
              <h6 className="fw-bold mb-3 text-uppercase small">Quick Links</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="/category" className="text-light text-decoration-none">Menu</a></li>
                <li className="mb-2"><a href="/cart" className="text-light text-decoration-none">Cart</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-6 col-sm-5 col-md-4 col-lg-2 px-3">
              <h6 className="fw-bold mb-3 text-uppercase small">Legal</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><a href="/help-support" className="text-light text-decoration-none">Help & Support</a></li>
                <li className="mb-2"><a href="/terms-conditions" className="text-light text-decoration-none">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-12 col-sm-10 col-md-6 col-lg-3 px-3">
              <h6 className="fw-bold mb-3 text-uppercase small text-center text-md-start">Contact Us</h6>
              <div className="small">
                <div className="mb-2 d-flex justify-content-center justify-content-md-start align-items-center">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  <span>Pune, Maharashtra</span>
                </div>
                <div className="mb-2 d-flex justify-content-center justify-content-md-start align-items-center">
                  <FaPhone className="text-primary me-2" />
                  <a href="tel:+918600346599" className="text-light text-decoration-none">+91 8600346599</a>
                </div>
                <div className="d-flex justify-content-center justify-content-md-start align-items-center">
                  <FaEnvelope className="text-primary me-2" />
                  <a href="mailto:info@kavyainfoweb.com" className="text-light text-decoration-none">info@kavyainfoweb.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Divider ===== */}
          <hr className="border-secondary my-4" />

          {/* ===== Bottom Row ===== */}
          <div className="text-center small">
            <p className="mb-0">&copy; 2025 <strong>Kavya Serve</strong>. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ====== Hover & Responsive CSS ====== */}
      <style>{`
        footer p:hover,
        footer h6:hover,
        footer li:hover,
        footer a:hover,
        footer span:hover {
          color: #FF6A00 !important;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        /* Center social icons only on mobile */
        @media (max-width: 768px) {
          .social-icons {
            justify-content: center !important;
          }
        }
      `}</style>
    </>
  )
}

export default Footer
