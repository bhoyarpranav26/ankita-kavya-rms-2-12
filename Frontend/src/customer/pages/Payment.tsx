import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaCreditCard, FaMobileAlt, FaWallet, FaArrowLeft, FaLock, FaUtensils, FaShoppingBag } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
 
const Payment: React.FC = () => {
  const { getTotalPrice, clearCart, cart } = useCart()
  const navigate = useNavigate()
 
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [upiId, setUpiId] = useState<string>('')
  const [upiError, setUpiError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderType, setOrderType] = useState<'Dine-In' | 'Takeaway'>(() => {
    const saved = sessionStorage.getItem('orderType')
    return saved === 'Takeaway' ? 'Takeaway' : 'Dine-In'
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
 
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
 
  useEffect(() => {
    if (cart.length === 0 && !sessionStorage.getItem('paymentInProgress')) {
      navigate('/cart')
      return
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [cart.length, navigate])

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const validateUPI = (upi: string): boolean => {
    const upiPattern = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/
    return upiPattern.test(upi)
  }

  const handleUpiChange = (value: string) => {
    setUpiId(value)
    if (value && !validateUPI(value)) {
      setUpiError('Invalid UPI ID format. Use format: yourname@upi')
    } else {
      setUpiError('')
    }
  }
 
  // Card validation functions
  const validateCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (!cleaned) return 'Card number is required'
    if (cleaned.startsWith('0')) return 'Card number cannot start with 0'
    if (cleaned.length < 13 || cleaned.length > 19) return 'Card number must be between 13 and 19 digits'
    if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits'
    // Additional validation: Check if it's a valid card number format (Luhn algorithm would be ideal, but basic validation is enough)
    return ''
  }

  const validateExpiryDate = (expiryDate: string): string => {
    if (!expiryDate) return 'Expiry date is required'
    const cleaned = expiryDate.replace(/\D/g, '')
    if (cleaned.length !== 4) return 'Please enter MM/YY format'
    
    const month = parseInt(cleaned.slice(0, 2), 10)
    const year = parseInt('20' + cleaned.slice(2, 4), 10)
    
    if (month < 1 || month > 12) return 'Month must be between 01 and 12'
    
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card has expired'
    }
    
    return ''
  }

  const validateCVV = (cvv: string): string => {
    if (!cvv) return 'CVV is required'
    if (!/^\d+$/.test(cvv)) return 'CVV must contain only digits'
    if (cvv.length !== 3 && cvv.length !== 4) return 'CVV must be 3 or 4 digits'
    return ''
  }

  const validateCardholderName = (name: string): string => {
    if (!name) return 'Cardholder name is required'
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Cardholder name must contain only alphabets and spaces'
    if (name.trim().length < 2) return 'Cardholder name must be at least 2 characters'
    return ''
  }

  const isCardValid = (): boolean => {
    return (
      validateCardNumber(cardDetails.cardNumber) === '' &&
      validateExpiryDate(cardDetails.expiryDate) === '' &&
      validateCVV(cardDetails.cvv) === '' &&
      validateCardholderName(cardDetails.cardholderName) === ''
    )
  }

  const handleCardInputChange = (field: string, value: string) => {
    let newValue = value
    let error = ''

    if (field === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '')
      newValue = cleaned.length >= 2 ? cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) : cleaned
      if (newValue.length === 5) {
        error = validateExpiryDate(newValue)
      }
    } else if (field === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '')
      // Prevent starting with 0
      if (cleaned && cleaned.startsWith('0')) {
        setCardErrors(prev => ({ ...prev, cardNumber: 'Card number cannot start with 0' }))
        return // Don't allow starting with 0
      }
      newValue = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
      // Validate if user has entered enough digits
      if (newValue.replace(/\s/g, '').length > 0) {
        error = validateCardNumber(newValue)
      }
    } else if (field === 'cvv') {
      newValue = value.replace(/\D/g, '')
      if (newValue.length >= 3) {
        error = validateCVV(newValue)
      }
    } else if (field === 'cardholderName') {
      // Only allow alphabets and spaces
      newValue = value.replace(/[^a-zA-Z\s]/g, '')
      if (newValue.trim()) {
        error = validateCardholderName(newValue)
      }
    }

    setCardDetails(prev => ({ ...prev, [field]: newValue }))
    setCardErrors(prev => ({ ...prev, [field]: error }))
  }
 
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <FaCreditCard className="fs-4 me-3" />, description: 'Pay with your card' },
    { id: 'upi', name: 'UPI', icon: <FaMobileAlt className="fs-4 me-3" />, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'wallet', name: 'Digital Wallet', icon: <FaWallet className="fs-4 me-3" />, description: 'Pay with wallet' }
  ]
 
  const handlePayment = () => {
    if (total <= 0) {
      alert('Cannot proceed with zero amount order')
      return
    }
    
    // Backend check - payment service not available
    alert('Payment service not available – backend not integrated.')
    return
    
    // Disabled payment processing until backend is ready
    /*
    sessionStorage.setItem('paymentInProgress', 'true')
    setIsProcessing(true)

    setTimeout(() => {
      const paymentMeta = selectedPayment === 'wallet' ? `wallet:${selectedWallet}` : selectedPayment
      sessionStorage.setItem('paymentCompleted', 'true')
      sessionStorage.setItem('paymentMethod', paymentMeta)
      sessionStorage.setItem('orderType', orderType)
      sessionStorage.setItem('orderTotal', total.toFixed(2))
      sessionStorage.setItem('showOrderPopup', 'true')
      clearCart() // ✅ Empty the cart
      setIsProcessing(false)
      navigate('/order-tracking')
    }, 800)
    */
  }
 
  if (cart.length === 0) {
    return null
  }

  if (!isOnline) {
    return (
      <div className="container py-5" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm text-center p-5">
              <h3 className="text-danger mb-3">No Internet Connection</h3>
              <p className="text-muted">Please check your internet connection and try again.</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate('/cart')}
              >
                Go Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
 
          {/* Back Button */}
          <Link to="/cart" className="btn btn-outline-secondary mb-4 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <FaArrowLeft />
          </Link>
 
          {/* Total Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #FFA500, #FF6B00)', color: 'white', borderRadius: '15px' }}>
            <div className="card-body text-center p-4">
              <h4>Total Amount</h4>
              <h2 className="fw-bold">₹{total.toFixed(2)}</h2>
              <p className="mb-0 opacity-75">{orderType} Order</p>
            </div>
          </div>
 
          {/* Order Type Selector */}
          <div className="d-flex justify-content-center mb-4 gap-3">
            <button
              className={`btn rounded-pill fw-semibold px-4 ${orderType === 'Dine-In' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
              onClick={() => {
                setOrderType('Dine-In')
                sessionStorage.setItem('orderType', 'Dine-In')
              }}
            >
              <FaUtensils className="me-2" /> Dine-In
            </button>
            <button
              className={`btn rounded-pill fw-semibold px-4 ${orderType === 'Takeaway' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
              onClick={() => {
                setOrderType('Takeaway')
                sessionStorage.setItem('orderType', 'Takeaway')
              }}
            >
              <FaShoppingBag className="me-2" /> Takeaway
            </button>
          </div>
 
          <div className="alert alert-info small text-center mb-4" role="alert">
            Payments are processed in demo mode. No real transactions are performed.
          </div>

          {/* Payment Methods */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold">Select Payment Method</h5>
            </div>
            <div className="card-body p-4">
 
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`payment-option mb-3 p-3 rounded-3 border cursor-pointer ${
                    selectedPayment === method.id ? 'border-primary bg-light' : 'border-secondary'
                  }`}
                  onClick={() => {
                    setSelectedPayment(method.id)
                    if (method.id !== 'wallet') {
                      setSelectedWallet('')
                    }
                    if (method.id !== 'upi') {
                      setUpiError('')
                    }
                  }}
                  style={{ transition: '0.3s', cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="text-primary">{method.icon}</div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{method.name}</h6>
                      <p className="mb-0 text-muted small">{method.description}</p>
                    </div>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === method.id}
                      readOnly
                    />
                  </div>
                </div>
              ))}
 
              {/* UPI Field */}
              {selectedPayment === 'upi' && (
                <div className="mt-4 p-3 bg-light rounded-3">
                  <label className="form-label fw-semibold">UPI ID</label>
                  <input
                    type="text"
                    className={`form-control ${upiError ? 'is-invalid' : ''}`}
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => handleUpiChange(e.target.value)}
                  />
                  {upiError && <div className="invalid-feedback d-block">{upiError}</div>}
                </div>
              )}

              {/* Wallet Options */}
              {selectedPayment === 'wallet' && (
                <div className="mt-4 p-3 bg-light rounded-3">
                  <label className="form-label fw-semibold">Select Wallet</label>
                  <div className="d-flex flex-column gap-2">
                    {['Paytm', 'PhonePe', 'Google Pay'].map(wallet => (
                      <button
                        key={wallet}
                        type="button"
                        className={`btn ${selectedWallet === wallet ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                  {!selectedWallet && (
                    <small className="text-danger d-block mt-2">Please select a wallet to continue.</small>
                  )}
                </div>
              )}
 
              {/* Card Details */}
              {selectedPayment === 'card' && (
                <div className="mt-4 p-4 bg-light rounded-3">
                  <div className="d-flex align-items-center mb-3">
                    <FaLock className="text-success me-2" />
                    <span className="fw-semibold text-dark">Secure Card Payment</span>
                  </div>
 
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Card Number</label>
                      <input
                        type="text"
                        className={`form-control ${cardErrors.cardNumber ? 'is-invalid' : cardDetails.cardNumber && !cardErrors.cardNumber ? 'is-valid' : ''}`}
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                        onBlur={() => {
                          const error = validateCardNumber(cardDetails.cardNumber)
                          setCardErrors(prev => ({ ...prev, cardNumber: error }))
                        }}
                        maxLength={19}
                      />
                      {cardErrors.cardNumber && (
                        <div className="invalid-feedback d-block">{cardErrors.cardNumber}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Expiry Date</label>
                      <input
                        type="text"
                        className={`form-control ${cardErrors.expiryDate ? 'is-invalid' : cardDetails.expiryDate && !cardErrors.expiryDate ? 'is-valid' : ''}`}
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        onBlur={() => {
                          const error = validateExpiryDate(cardDetails.expiryDate)
                          setCardErrors(prev => ({ ...prev, expiryDate: error }))
                        }}
                        maxLength={5}
                      />
                      {cardErrors.expiryDate && (
                        <div className="invalid-feedback d-block">{cardErrors.expiryDate}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">CVV</label>
                      <input
                        type="text"
                        className={`form-control ${cardErrors.cvv ? 'is-invalid' : cardDetails.cvv && !cardErrors.cvv ? 'is-valid' : ''}`}
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        onBlur={() => {
                          const error = validateCVV(cardDetails.cvv)
                          setCardErrors(prev => ({ ...prev, cvv: error }))
                        }}
                        maxLength={4}
                      />
                      {cardErrors.cvv && (
                        <div className="invalid-feedback d-block">{cardErrors.cvv}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Cardholder Name</label>
                      <input
                        type="text"
                        className={`form-control ${cardErrors.cardholderName ? 'is-invalid' : cardDetails.cardholderName && !cardErrors.cardholderName ? 'is-valid' : ''}`}
                        placeholder="John Doe"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                        onBlur={() => {
                          const error = validateCardholderName(cardDetails.cardholderName)
                          setCardErrors(prev => ({ ...prev, cardholderName: error }))
                        }}
                      />
                      {cardErrors.cardholderName && (
                        <div className="invalid-feedback d-block">{cardErrors.cardholderName}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
 
              {/* Backend Not Available Message */}
              <div className="alert alert-info mt-4 mb-3" role="alert">
                <strong>Payment service not available</strong> – backend not integrated.
              </div>

              {/* Pay Button - Disabled until backend is ready */}
              <button
                onClick={handlePayment}
                disabled={true}
                className="btn w-100 mt-2 py-3 fw-semibold rounded-pill text-white"
                style={{
                  background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
                  opacity: 0.6,
                  cursor: 'not-allowed'
                }}
                title="Payment service not available – backend not integrated"
              >
                Pay ₹{total.toFixed(2)} (Disabled)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Payment