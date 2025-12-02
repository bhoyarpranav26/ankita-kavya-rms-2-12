import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuItems as defaultMenuItems } from '../../data/menuItems'
import type { MenuItem } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import AdminLayout from '../components/AdminLayout'

const MenuManagement: React.FC = () => {
  const navigate = useNavigate()
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('adminMenu')
    return saved ? JSON.parse(saved) : defaultMenuItems
  })
  const { authFetch } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  type FormDataType = {
    name: string
    price: number
    category: string
    image: string
    description: string
    type: 'veg' | 'nonveg'
    spiceLevel: 'mild' | 'medium' | 'hot'
  }

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    price: 0,
    category: 'Starters',
    image: '',
    description: '',
    type: 'veg',
    spiceLevel: 'mild'
  })

  const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages']

  // Responsive detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    if (!isAuthenticated) navigate('/admin')
    // Try to fetch menu items from backend (admin protected)
    ;(async () => {
      try {
        const res = await authFetch('/api/menu')
        if (!res.ok) throw new Error('Failed to fetch from server')
        const data = await res.json()
        const items = data.items || data
        if (Array.isArray(items)) {
          setLocalMenuItems(items.map((it: any, idx: number) => ({
            id: it._id || it.id || idx + 1,
            name: it.name,
            price: Number(it.price || 0),
            category: it.category || 'Starters',
            image: it.image || '',
            description: it.description || '',
            type: it.type || 'veg',
            spiceLevel: it.spiceLevel || 'mild'
          })))
        }
      } catch (err) {
        // keep fallback localMenuItems
      }
    })()
  }, [navigate, authFetch])

  useEffect(() => {
    localStorage.setItem('adminMenu', JSON.stringify(localMenuItems))
  }, [localMenuItems])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    ;(async () => {
      try {
        if (editingItem) {
          // update
          const res = await authFetch(`/api/menu/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
          if (!res.ok) throw new Error('Update failed')
          // const updated = await res.json()
          setLocalMenuItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, type: formData.type, spiceLevel: formData.spiceLevel } : item))
          setEditingItem(null)
          alert('✅ Item updated successfully!')
        } else {
          const res = await authFetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
          if (!res.ok) throw new Error('Create failed')
          await res.json()
          const newItem: MenuItem = {
            ...formData,
            id: Math.max(0, ...localMenuItems.map(i => i.id)) + 1,
            type: formData.type,
            spiceLevel: formData.spiceLevel
          }
          setLocalMenuItems(prev => [...prev, newItem])
          alert('✅ New item added successfully!')
        }
      } catch (err) {
        // fallback to local-only behavior if server fails
        if (editingItem) {
          setLocalMenuItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, id: editingItem.id, type: formData.type, spiceLevel: formData.spiceLevel } : item))
          setEditingItem(null)
          alert('✅ Item updated locally (server unreachable)')
        } else {
          const newItem: MenuItem = {
            ...formData,
            id: Math.max(0, ...localMenuItems.map(item => item.id)) + 1,
            type: formData.type,
            spiceLevel: formData.spiceLevel
          }
          setLocalMenuItems(prev => [...prev, newItem])
          alert('✅ New item added locally (server unreachable)')
        }
      } finally {
        resetForm()
      }
    })()
  }

const handleDelete = (id: number) => {
  if (!window.confirm('Are you sure you want to delete this item?')) return
  ;(async () => {
    try {
      const res = await authFetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setLocalMenuItems((prev) => prev.filter((item) => item.id !== id))
      alert('🗑️ Item deleted!')
    } catch (err) {
      // fallback local delete
      setLocalMenuItems((prev) => prev.filter((item) => item.id !== id))
      alert('🗑️ Item deleted locally (server unreachable)')
    }
  })()
}

const resetForm = () => {
  setFormData({
    name: '',
    price: 0,
    category: 'Starters',
    image: '',
    description: '',
    type: 'veg',
    spiceLevel: 'mild'
  })
  setShowAddForm(false)
  setEditingItem(null)
}

const handleEdit = (item: MenuItem) => {
  setEditingItem(item)
  setFormData({
    name: item.name,
    price: item.price,
    category: item.category,
    image: item.image,
    description: item.description,
    type: item.type,
    spiceLevel: item.spiceLevel
  })
  setShowAddForm(true)
}


  const toggleExpand = (id: number) => {
    if (isMobile) {
      setExpandedId(prev => (prev === id ? null : id))
    }
  }

  return (
    <AdminLayout title="Menu Management">
      <div
        className="menu-management-container"
        style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '100vh' }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h1 className="display-6 fw-bold text-primary mb-2">Menu Management</h1>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <FaPlus className="me-2" /> Add New Item
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingItem) && (
          <div
            className="card shadow-sm mb-4"
            style={{ borderRadius: '12px', overflow: 'hidden', maxWidth: '900px', margin: 'auto' }}
          >
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="price" className="form-label">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="image" className="form-label">
                      Image URL
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary me-2">
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="table-responsive">
          <table className="table align-middle shadow-sm bg-white rounded">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name & Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localMenuItems.map(item => (
                <tr key={item.id} onClick={() => toggleExpand(item.id)} style={{ cursor: isMobile ? 'pointer' : 'default' }}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    <br />
                    <small className="text-muted">{item.category}</small>
                  </td>
                  <td className="text-muted">
                    {isMobile && expandedId !== item.id
                      ? item.description.slice(0, 25) + '...'
                      : item.description}
                  </td>
                  <td className="fw-bold text-primary">₹{item.price.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {localMenuItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No menu items available. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style>
          {`
            @media (max-width: 768px) {
              table thead {
                display: none;
              }
              table, table tbody, table tr, table td {
                display: block;
                width: 100%;
              }
              table tr {
                margin-bottom: 1rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                overflow: hidden;
              }
              table td {
                padding: 10px 15px;
                border: none;
              }
              table td img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 12px 12px 0 0;
              }
            }
          `}
        </style>
      </div>
    </AdminLayout>
  )
}

export default MenuManagement