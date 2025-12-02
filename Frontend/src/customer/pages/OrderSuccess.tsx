import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaHome, FaClock, FaUtensils, FaShippingFast, FaMapMarkerAlt } from 'react-icons/fa'

const OrderSuccess: React.FC = () => {
  const location = useLocation()
  const orderId = location.state?.orderId || 'FF123456789'
  const [currentStep, setCurrentStep] = useState(0)

  // Order tracking steps
  const trackingSteps = [
    { icon: <FaUtensils />, title: 'Order Confirmed', description: 'Your order has been received', time: 'Just now' },
    { icon: <FaClock />, title: 'Preparing Food', description: 'Our chefs are preparing your meal', time: '5 mins' },
    { icon: <FaShippingFast />, title: 'Out for Delivery', description: 'Your order is on the way', time: '25 mins' },
    { icon: <FaMapMarkerAlt />, title: 'Delivered', description: 'Enjoy your meal!', time: '35 mins' }
  ]

  // Auto-progress through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < trackingSteps.length - 1 ? prev + 1 : prev))
    }, 8000) // Change step every 8 seconds

    return () => clearInterval(timer)
  }, [trackingSteps.length])

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(to bottom, #fffaf4, #fff3e0)', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          {/* Success Header */}
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
              <FaCheckCircle size={36} />
            </div>
            <h1 className="display-5 fw-bold mb-3" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Order Placed Successfully!
            </h1>
            <p className="lead text-muted mb-4">
              Thank you for your order. Your delicious food will be prepared and delivered soon.
            </p>
          </div>

          {/* Order ID Card */}
          <div className="card border-0 shadow-sm mb-5" style={{
            background: 'linear-gradient(135deg, #FF6A00, #FF9900)',
            color: 'white',
            borderRadius: '15px'
          }}>
            <div className="card-body text-center p-4">
              <h5 className="mb-2 opacity-75">Order ID</h5>
              <h2 className="fw-bold mb-2">{orderId}</h2>
              <small className="opacity-75">Please save this order ID for your reference</small>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-header border-0" style={{
              background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
              color: 'white',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-0 fw-semibold text-center">Order Tracking</h5>
            </div>
            <div className="card-body p-4">
              <div className="tracking-container">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="tracking-step d-flex align-items-center mb-4">
                    <div className="tracking-icon me-3">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          index <= currentStep ? 'text-white' : 'text-muted'
                        }`}
                        style={{
                          width: '50px',
                          height: '50px',
                          background: index <= currentStep
                            ? 'linear-gradient(135deg, #FF6A00, #FF9900)'
                            : '#e9ecef',
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div className="tracking-content flex-grow-1">
                      <h6 className={`fw-semibold mb-1 ${index <= currentStep ? 'text-dark' : 'text-muted'}`}>
                        {step.title}
                      </h6>
                      <p className={`mb-1 small ${index <= currentStep ? 'text-dark' : 'text-muted'}`}>
                        {step.description}
                      </p>
                      <small className={`text-muted ${index <= currentStep ? 'fw-semibold' : ''}`}>
                        {step.time}
                      </small>
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className="tracking-line ms-3" style={{
                        width: '2px',
                        height: '40px',
                        background: index < currentStep ? '#FF6A00' : '#e9ecef',
                        transition: 'background 0.3s ease-in-out'
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body p-4">
              <h6 className="fw-semibold mb-3 text-center">What happens next?</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="text-primary me-3">
                      <FaUtensils size={20} />
                    </div>
                    <div>
                      <small className="fw-semibold">Order Confirmation</small>
                      <br />
                      <small className="text-muted">Sent to your email</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="text-primary me-3">
                      <FaClock size={20} />
                    </div>
                    <div>
                      <small className="fw-semibold">Preparation Time</small>
                      <br />
                      <small className="text-muted">15-20 minutes</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="text-primary me-3">
                      <FaShippingFast size={20} />
                    </div>
                    <div>
                      <small className="fw-semibold">Delivery Partner</small>
                      <br />
                      <small className="text-muted">Will contact you soon</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 bg-light rounded-3">
                    <div className="text-primary me-3">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <small className="fw-semibold">Estimated Delivery</small>
                      <br />
                      <small className="text-muted">30-45 minutes</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <Link
                to="/category"
                className="btn btn-lg me-md-2 text-white text-decoration-none"
                style={{
                  background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 30px'
                }}
              >
                <FaHome className="me-2" />
                Back to Home
              </Link>
              <Link
                to="/menu"
                className="btn btn-lg btn-outline-secondary text-decoration-none"
                style={{
                  border: '2px solid #FF6A00',
                  color: '#FF6A00',
                  borderRadius: '25px',
                  padding: '12px 30px'
                }}
              >
                Order Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess