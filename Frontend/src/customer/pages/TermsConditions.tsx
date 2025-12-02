import React from 'react'
import { FaFileContract, FaShieldAlt, FaUserCheck, FaCreditCard } from 'react-icons/fa'

const TermsConditions: React.FC = () => {
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
              <FaFileContract size={36} />
            </div>
            <h1 className="display-5 fw-bold mb-4" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Terms & Conditions
            </h1>
            <p className="lead text-muted">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-center mb-5">
            <p className="text-muted">Last updated: December 2024</p>
          </div>

          {/* Terms Sections */}
          <div className="accordion" id="termsAccordion">
            {/* Acceptance of Terms */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms1">
                  <FaUserCheck className="me-2 text-primary" />
                  Acceptance of Terms
                </button>
              </h2>
              <div id="terms1" className="accordion-collapse collapse show" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>By accessing and using our restaurant's online ordering system, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                </div>
              </div>
            </div>

            {/* Use License */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms2">
                  <FaShieldAlt className="me-2 text-primary" />
                  Use License
                </button>
              </h2>
              <div id="terms2" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>Permission is granted to temporarily access the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                    <li>Attempt to decompile or reverse engineer any software contained on our website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Orders and Payment */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms3">
                  <FaCreditCard className="me-2 text-primary" />
                  Orders and Payment
                </button>
              </h2>
              <div id="terms3" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <h6>Order Acceptance</h6>
                  <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to food availability, errors in product information, or payment issues.</p>

                  <h6>Payment Terms</h6>
                  <p>Payment must be made at the time of ordering. We accept various payment methods including credit cards, debit cards, and digital wallets. All payments are processed securely.</p>

                  <h6>Pricing</h6>
                  <p>Prices are subject to change without notice. The price charged will be the price in effect at the time the order is placed.</p>
                </div>
              </div>
            </div>

            {/* Delivery and Pickup */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms4">
                  Delivery and Pickup
                </button>
              </h2>
              <div id="terms4" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <h6>Delivery</h6>
                  <p>Delivery is available within our designated delivery area. Delivery times are estimates only and may vary. We are not responsible for delays caused by traffic, weather, or other unforeseen circumstances.</p>

                  <h6>Pickup</h6>
                  <p>Orders placed for pickup must be collected within 30 minutes of the ready time specified. We reserve the right to cancel orders not collected within this timeframe.</p>

                  <h6>Order Changes</h6>
                  <p>Once an order has been confirmed and preparation has begun, changes cannot be made. Please contact us immediately if you need to modify your order before preparation starts.</p>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms5">
                  Refund Policy
                </button>
              </h2>
              <div id="terms5" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>We strive to provide the best service possible. If you're not satisfied with your order, please contact us immediately. Refunds will be considered on a case-by-case basis for:</p>
                  <ul>
                    <li>Orders that haven't been prepared yet</li>
                    <li>Orders with incorrect items</li>
                    <li>Orders that arrive significantly late</li>
                    <li>Orders that are unsatisfactory in quality</li>
                  </ul>
                  <p>Refunds will be processed to the original payment method within 3-5 business days.</p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms6">
                  Privacy Policy
                </button>
              </h2>
              <div id="terms6" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>Your privacy is important to us. We collect personal information only for the purpose of processing your orders and improving our services. We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law.</p>

                  <p>We use secure encryption to protect your payment information and maintain strict security measures to safeguard your personal data.</p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms7">
                  Limitation of Liability
                </button>
              </h2>
              <div id="terms7" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>In no event shall our restaurant or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our services, even if we have been notified orally or in writing of the possibility of such damage.</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="accordion-item border-0 shadow-sm mb-0">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms8">
                  Contact Information
                </button>
              </h2>
              <div id="terms8" className="accordion-collapse collapse" data-bs-parent="#termsAccordion">
                <div className="accordion-body">
                  <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                  <ul className="list-unstyled">
                    <li><strong>Phone:</strong>  +91 8600346599</li>
                    <li><strong>Email:</strong> kavyainfoweb.com</li>
                    <li><strong>Address:</strong> Pune, Maharashtra</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="text-center mt-5">
            <p className="text-muted">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsConditions