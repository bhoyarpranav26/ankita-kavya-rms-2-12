import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaArrowLeft } from 'react-icons/fa'

interface SignupProps {
  onClose: () => void
  onSwitchToLogin: () => void
  onSignup: (userData: { name: string; email: string; phone: string; password: string }) => void
}

interface OTPVerificationProps {
  email: string
  onVerify: (otp: string) => void
  onResend: () => void
  onBack: () => void
}

const OTPVerification: React.FC<OTPVerificationProps> = (props: OTPVerificationProps) => {
  const { email, onVerify, onResend, onBack } = props
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [correctOTP] = useState(() => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('Generated OTP for testing:', otp) // For testing purposes only
    return otp
  }) // Mock correct OTP - in production, this would come from backend

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
      setIsExpired(true)
    }
  }, [resendTimer])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a complete 6-digit OTP')
      return
    }

    if (isExpired) {
      setOtpError('Invalid or expired OTP')
      return
    }

    setIsLoading(true)
    setOtpError('')
    
    // Simulate backend validation - in real app, this would be an API call
    setTimeout(() => {
      // Mock validation: only accept the correct OTP
      if (otp === correctOTP) {
        onVerify(otp)
      } else {
        setOtpError('Invalid or expired OTP')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleResend = () => {
    onResend()
    setResendTimer(30)
    setCanResend(false)
    setIsExpired(false)
    setOtp('')
    setOtpError('')
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn btn-link text-dark border-0 p-0 me-3"
              onClick={onBack}
              style={{ fontSize: '18px' }}
            >
              <FaArrowLeft />
            </button>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => {}}
              style={{ fontSize: '14px' }}
            ></button>
          </div>

          <div className="modal-body px-4 pb-4">
            <div className="text-center mb-4">
              <img
                src="/assets/images/Logo.png"
                alt="Logo"
                style={{
                  width: '120px',
                  height: '40px',
                  objectFit: 'contain',
                }}
              />
            </div>

            <h4 className="text-center fw-bold mb-3" style={{ color: '#333' }}>
              Verify Your Email
            </h4>

            <p className="text-center text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              We've sent a 6-digit verification code to<br />
              <strong>{email}</strong>
            </p>

            <div className="mb-4">
              <label className="form-label fw-semibold text-center d-block" style={{ color: '#555' }}>
                Enter Verification Code
              </label>
              <div className="d-flex justify-content-center gap-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control text-center fw-bold"
                    style={{
                      width: '45px',
                      height: '50px',
                      fontSize: '20px',
                      borderRadius: '8px',
                      border: '2px solid #FF6A00',
                      backgroundColor: '#f8f9fa'
                    }}
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value) {
                        const newOtp = otp.split('')
                        newOtp[index] = value
                        setOtp(newOtp.join(''))
                        setOtpError('') // Clear error when user types
                        // Auto-focus next input
                        if (index < 5 && e.target.nextElementSibling) {
                          (e.target.nextElementSibling as HTMLInputElement).focus()
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const newOtp = otp.split('')
                        newOtp[index - 1] = ''
                        setOtp(newOtp.join(''))
                        // Focus previous input
                        const target = e.target as HTMLInputElement
                        if (target.previousElementSibling) {
                          (target.previousElementSibling as HTMLInputElement).focus()
                        }
                      }
                    }}
                  />
                ))}
              </div>
              {otpError && <div className="text-danger text-center mt-2" style={{ fontSize: '14px' }}>{otpError}</div>}
            </div>

            <button
              className="btn w-100 text-white fw-semibold py-3 mb-3"
              disabled={isLoading || otp.length !== 6 || isExpired}
              onClick={handleVerify}
              style={{
                background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px'
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Verifying...
                </>
              ) : (
                'Verify & Complete Signup'
              )}
            </button>

            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '14px' }}>
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    className="btn btn-link text-decoration-none p-0 fw-semibold"
                    onClick={handleResend}
                    style={{ color: '#FF6A00', fontSize: '14px' }}
                  >
                    Resend Code
                  </button>
                ) : (
                  <span style={{ color: '#FF6A00', fontSize: '14px' }}>
                    Resend in {resendTimer}s
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Signup: React.FC<SignupProps> = (props: SignupProps) => {
  const { onClose, onSwitchToLogin, onSignup } = props
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showOTPVerification, setShowOTPVerification] = useState(false)

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/

  const validateField = (field: string, value: string, data = formData): string => {
    switch (field) {
      case 'name': {
        const trimmed = value.trim()
        if (!trimmed) return 'Full name is required'
        if (trimmed.length < 3) return 'Full name must be 3+ letters'
        return ''
      }
      case 'email': {
        const trimmed = value.trim()
        if (!trimmed) return 'Email is required'
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address'
        return ''
      }
      case 'phone': {
        if (!value.trim()) return 'Phone number is required'
        // Indian mobile numbers must start with 6, 7, 8, or 9 (10 digits total)
        if (!/^[6-9][0-9]{9}$/.test(value)) {
          return 'Please enter a valid Indian mobile number (10 digits starting with 6–9)'
        }
        return ''
      }
      case 'password': {
        if (!value) return 'Password is required'
        if (/\s/.test(value)) return 'Password cannot contain spaces.'
        if (!strongPasswordRegex.test(value)) {
          return 'Password must be 8+ chars with uppercase, lowercase, number & special character'
        }
        return ''
      }
      case 'confirmPassword': {
        if (!value) return 'Please confirm your password'
        if (value !== data.password) return 'Passwords do not match'
        return ''
      }
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let filteredValue = value
    if (name === 'name') {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '')
    } else if (name === 'phone') {
      // Only allow digits 6-9 as first digit, then 0-9 for remaining
      if (value.length === 0) {
        filteredValue = ''
      } else if (value.length === 1) {
        filteredValue = /^[6-9]$/.test(value) ? value : ''
      } else {
        filteredValue = value.replace(/[^0-9]/g, '').slice(0, 10)
        // Ensure first digit is 6-9
        if (filteredValue.length > 0 && !/^[6-9]/.test(filteredValue)) {
          filteredValue = filteredValue.slice(1)
        }
      }
    } else if (name === 'password' || name === 'confirmPassword') {
      // Remove spaces from password fields
      filteredValue = value.replace(/\s/g, '')
    }
    setFormData(prev => {
      const updated = { ...prev, [name]: filteredValue }
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validateField(name, filteredValue, updated),
        ...(name === 'password' || name === 'confirmPassword'
          ? { confirmPassword: validateField('confirmPassword', updated.confirmPassword, updated) }
          : {})
      }))
      return updated
    })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, (formData as any)[key])
    })

    setErrors(newErrors)
    return Object.values(newErrors).every(msg => !msg)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      setShowOTPVerification(true)
    } catch (err: any) {
      console.error('Signup request failed:', err)
      // Provide a clearer message for network / CORS issues in production
      alert(err.message || 'Network error: failed to reach the server. Please check your connection or try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerify = (otp: string) => {
    // call backend verify endpoint
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'OTP verification failed')
        console.log('OTP Verified:', data)
        onSignup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
      } catch (err: any) {
        console.error('OTP verification failed:', err)
        alert(err.message || 'OTP verification failed: network error or server issue.')
      }
    })()
  }

  const handleOTPResend = () => {
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name || 'User',
            email: formData.email,
            phone: formData.phone,
            password: formData.password || 'TempPass123!'
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Resend failed')
        alert('OTP resent to ' + formData.email)
        } catch (err: any) {
        console.error('Resend OTP failed:', err)
        alert(err.message || 'Failed to resend OTP: network error or server issue.')
      }
    })()
  }

  const handleOTPBack = () => {
    setShowOTPVerification(false)
  }

  const allFieldsFilled = Object.values(formData).every(value => value.trim())
  const hasValidationErrors = Object.values(errors).some(error => Boolean(error))
  const isSubmitDisabled = isLoading || !allFieldsFilled || hasValidationErrors

  if (showOTPVerification) {
    return (
      <OTPVerification
        email={formData.email}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onBack={handleOTPBack}
      />
    )
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={onClose}
              style={{ fontSize: '14px' }}
            ></button>
          </div>

          <div className="modal-body px-4 pb-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src="/assets/images/Logo.png"
                alt="Logo"
                style={{
                  width: '150px',
                  height: '50px',
                  objectFit: 'contain',
                }}
              />
            </div>

            <h4 className="text-center fw-bold mb-4" style={{ color: '#333' }}>
              Create Account
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#555' }}>
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <FaUser style={{ color: '#FF6A00' }} />
                  </span>
                  <input
  type="text"
  name="name"
  className={`form-control border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
  placeholder="Enter your full name"
  value={formData.name}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only letters (A-Z, a-z) and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      handleInputChange(e);
    }
  }}
                    onBlur={() => setErrors(prev => ({ ...prev, name: validateField('name', formData.name) }))}
  required
  style={{
    borderRadius: '0 8px 8px 0',
    borderLeft: 'none',
    padding: '12px 16px'
  }}
/>

                </div>
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#555' }}>
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <FaEnvelope style={{ color: '#FF6A00' }} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => setErrors(prev => ({ ...prev, email: validateField('email', formData.email) }))}
                    required
                    style={{
                      borderRadius: '0 8px 8px 0',
                      borderLeft: 'none',
                      padding: '12px 16px'
                    }}
                  />
                </div>
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>

              {/* Phone Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#555' }}>
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <FaPhone style={{ color: '#FF6A00' }} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control border-start-0 ps-0 ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => setErrors(prev => ({ ...prev, phone: validateField('phone', formData.phone) }))}
                    required
                    style={{
                      borderRadius: '0 8px 8px 0',
                      borderLeft: 'none',
                      padding: '12px 16px'
                    }}
                  />
                </div>
                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#555' }}>
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <FaLock style={{ color: '#FF6A00' }} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-control border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => setErrors(prev => ({ ...prev, password: validateField('password', formData.password) }))}
                    required
                    style={{
                      borderLeft: 'none',
                      borderRight: 'none',
                      padding: '12px 16px'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      borderRadius: '0 8px 8px 0',
                      borderLeft: 'none'
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: '#555' }}>
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <FaLock style={{ color: '#FF6A00' }} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-control border-start-0 border-end-0 ps-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() =>
                      setErrors(prev => ({
                        ...prev,
                        confirmPassword: validateField('confirmPassword', formData.confirmPassword)
                      }))
                    }
                    required
                    style={{
                      borderLeft: 'none',
                      borderRight: 'none',
                      padding: '12px 16px'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      borderRadius: '0 8px 8px 0',
                      borderLeft: 'none'
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="btn w-100 text-white fw-semibold py-3 mb-3"
                disabled={isSubmitDisabled}
                style={{
                  background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  opacity: isSubmitDisabled ? 0.6 : 1,
                  cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="text-center mb-3">
                <span style={{ color: '#999', fontSize: '14px' }}>Already have an account?</span>
              </div>

              {/* Switch to Login */}
              <button
                type="button"
                className="btn btn-outline-secondary w-100 fw-semibold py-2"
                onClick={onSwitchToLogin}
                style={{
                  borderRadius: '12px',
                  borderColor: '#FF6A00',
                  color: '#FF6A00'
                }}
              >
                Sign In Instead
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup