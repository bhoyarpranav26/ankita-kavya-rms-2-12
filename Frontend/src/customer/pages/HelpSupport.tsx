import React from 'react'
import { FaQuestionCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

const HelpSupport: React.FC = () => {
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
              <FaQuestionCircle size={36} />
            </div>
            <h1 className="display-5 fw-bold mb-4" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Help & Support
            </h1>
            <p className="lead text-muted">
              We're here to help! Get answers to common questions or contact our support team.
            </p>
          </div>

          {/* Contact Information */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <FaPhone size={30} />
                  </div>
                  <h5 className="card-title fw-semibold">Phone Support</h5>
                  <p className="card-text text-muted mb-2">Call us for immediate assistance</p>
               <p className="fw-bold text-primary mb-0">
  <a href="tel:+918600346599" className="text-primary text-decoration-none">
    +91 8600346599
  </a>
</p>

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <FaEnvelope size={30} />
                  </div>
                  <h5 className="card-title fw-semibold">Email Support</h5>
                  <p className="card-text text-muted mb-2">Send us an email anytime</p>
<p className="fw-bold text-primary mb-0">
  <a href="mailto:info@kavyainfoweb.com" className="text-primary text-decoration-none">
kavyainfoweb.com
  </a>
</p>                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <FaMapMarkerAlt size={30} />
                  </div>
                  <h5 className="card-title fw-semibold">Visit Us</h5>
                  <p className="card-text text-muted mb-2">Our restaurant location</p>
                  <p className="fw-bold text-primary mb-0">Pune, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-header border-0" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              color: 'white',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-0 fw-semibold text-center">
                <FaClock className="me-2" />
                Business Hours
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Restaurant Hours</h6>
                  <div className="mb-2">
                    <span className="fw-semibold">Monday - Friday:</span>
                    <span className="ms-2">11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-semibold">Saturday:</span>
                    <span className="ms-2">12:00 PM - 11:00 PM</span>
                  </div>
                  <div className="mb-0">
                    <span className="fw-semibold">Sunday:</span>
                    <span className="ms-2">12:00 PM - 9:00 PM</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Support Hours</h6>
                  <div className="mb-2">
                    <span className="fw-semibold">Phone Support:</span>
                    <span className="ms-2">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-semibold">Email Support:</span>
                    <span className="ms-2">24/7</span>
                  </div>
                  <div className="mb-0">
                    <span className="fw-semibold">Online Orders:</span>
                    <span className="ms-2">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-4 text-center">Frequently Asked Questions</h5>
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I place an order?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Browse our menu, add items to your cart, select your order type (dine-in or delivery), and proceed to checkout. Choose your payment method and complete your order.
                    </div>
                  </div>
                </div>
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      What are your delivery areas?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We deliver within a 5-mile radius of our restaurant. Delivery fees may apply based on distance.
                    </div>
                  </div>
                </div>
                <div className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      Can I modify my order after placing it?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Please contact us immediately at +1 (555) 123-4567 if you need to modify your order. We'll do our best to accommodate changes before preparation begins.
                    </div>
                  </div>
                </div>
                <div className="accordion-item border-0 mb-0">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                      Do you offer refunds?
                    </button>
                  </h2>
                  <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We offer refunds for orders that haven't been prepared yet. For prepared orders, please contact us to discuss alternatives.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpSupport