import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock authentication - in real app, this would be API call
    let role: 'admin' | 'superadmin' | null = null;
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      role = 'admin';
    } else if (credentials.username === 'superadmin' && credentials.password === 'super123') {
      role = 'superadmin';
    }

    if (role) {
      const user = {
        id: credentials.username,
        name: role === 'superadmin' ? 'Super Admin' : 'Admin',
        email: `${credentials.username}@restom.com`,
        profilePicture: '',
        role
      };
      login(user);
      navigate(role === 'superadmin' ? '/admin/super-dashboard' : '/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">
                <FaLock className="me-2" />
                Admin Login
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <FaUser className="me-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <FaLock className="me-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Demo credentials: admin / admin123 or superadmin / super123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin