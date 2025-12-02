import React from 'react'
import { FaShieldAlt, FaLock, FaUserShield, FaEye } from 'react-icons/fa'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container py-5" style={{ background: 'linear-gradient(to bottom, #fffaf4, #fff3e0)', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #FF6A00, #FF9900)',
                color: 'white'
              }}
            >
              <FaShieldAlt size={36} />
            </div>
            <h1 className="display-5 fw-bold mb-4" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Privacy Policy
            </h1>
            <p className="lead text-muted">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-center mb-5">
            <p className="text-muted">Last updated: December 2024</p>
          </div>

          {/* Privacy Sections */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">
                <FaLock className="me-2 text-primary" />
                Information We Collect
              </h5>
              <p>We collect information that you provide directly to us when you:</p>
              <ul>
                <li>Place an order through our website</li>
                <li>Create an account or profile</li>
                <li>Contact us for customer support</li>
                <li>Subscribe to our newsletter or promotional communications</li>
              </ul>
              <p className="mt-3">The types of information we may collect include:</p>
              <ul>
                <li>Name, email address, phone number, and delivery address</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Order history and preferences</li>
                <li>Device information and IP address</li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">
                <FaEye className="me-2 text-primary" />
                How We Use Your Information
              </h5>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and our services</li>
                <li>Send you promotional offers and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">
                <FaUserShield className="me-2 text-primary" />
                Information Sharing
              </h5>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul>
                <li>With service providers who assist us in operating our website and conducting our business</li>
                <li>With delivery partners to fulfill your orders</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">
                <FaLock className="me-2 text-primary" />
                Data Security
              </h5>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
              <p className="mt-3">We use secure encryption (SSL/TLS) to protect your payment information during transmission.</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Your Rights</h5>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Cookies</h5>
              <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Children's Privacy</h5>
              <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Changes to This Policy</h5>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Contact Us</h5>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-unstyled">
                <li><strong>Phone:</strong> +91 8600346599</li>
                <li><strong>Email:</strong> info@kavyainfoweb.com</li>
                <li><strong>Address:</strong> Pune, Maharashtra</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy






