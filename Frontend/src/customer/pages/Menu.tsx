import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { menuItems as localMenuItems } from '../../data/menuItems'
import { useCart } from '../../context/CartContext'
import type { MenuItem } from '../../context/CartContext'
import { FaPlus, FaMinus } from 'react-icons/fa'

const Menu: React.FC = () => {
  const { addToCart, cart, updateQuantity, updateSpiceLevel } = useCart()
  const location = useLocation()
  
  // 🟢 FIX 1: Initialize selectedCategory using a function that reads the URL immediately
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const urlParams = new URLSearchParams(location.search)
    const category = urlParams.get('category')
    return (category && category !== 'All Items') ? category : 'All'
  })
  
  // Initialize selectedType to 'all' as default if nothing is found
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem('selectedType') || 'all'
  )
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const urlParams = new URLSearchParams(location.search)
    return urlParams.get('search') || ''
  })
  const [selectedPrice, setSelectedPrice] = useState<string>('All Prices')
  const [selectedSpiceLevels, setSelectedSpiceLevels] = useState<{ [key: number]: 'mild' | 'medium' | 'hot' }>({})
  const [requestedItem, setRequestedItem] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(location.search)
    return urlParams.get('item') || null
  })

  // 🟢 FIX 2: Refactor useEffect. It is now only needed for selectedType logic 
  // or external state changes, but we'll keep the category logic just in case 
  // the URL changes later in the app's lifecycle (though initial load is fixed above).
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const category = urlParams.get('category')
    const typeFromUrl = urlParams.get('type')
    const itemFromUrl = urlParams.get('item')

    // Set category if provided (for subsequent location changes, not initial load)
    if (category && category !== 'All Items' && category !== selectedCategory) {
      setSelectedCategory(category)
    }

    // Update selected type state
    const type = typeFromUrl || localStorage.getItem('selectedType') || 'veg'
    setSelectedType(type)

    if (itemFromUrl) {
      const decodedItem = decodeURIComponent(itemFromUrl)
      setRequestedItem(decodedItem)
      setSearchQuery(decodedItem)
    }
  }, [location.search, selectedCategory])

  useEffect(() => {
    setSelectedSpiceLevels(prev => {
      let changed = false
      const updated = { ...prev }
      Object.keys(updated).forEach(key => {
        const id = Number(key)
        if (!cart.some(item => item.id === id)) {
          delete updated[id]
          changed = true
        }
      })
      return changed ? updated : prev
    })
  }, [cart])

  // 🟢 Hide Veg/Non-Veg buttons only for Desserts, Beverages & Kids.
  // This now uses the correctly initialized selectedCategory.
  const hideTypeFilter = selectedCategory === 'Desserts' || selectedCategory === 'Beverages' || selectedCategory === 'Kids'

  const [backendItems, setBackendItems] = useState<MenuItem[] | null>(null)
  // categories can be derived from source items when needed

  // Fetch items from backend on mount
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/menu`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (data && Array.isArray(data.items)) {
          setBackendItems(data.items)
        }
      } catch (err) {
        // network error - keep using local menu
        setBackendItems(null)
      }
    })()
  }, [])

  const getActiveSpiceLevel = (itemId: number): 'mild' | 'medium' | 'hot' => {
    return (
      selectedSpiceLevels[itemId] ||
      (cart.find(cartItem => cartItem.id === itemId)?.spiceLevel ?? 'medium')
    )
  }

  // Filter items based on category, type, price, search, and requested item
  const normalizedSelectedType = selectedType.toLowerCase()

  const filteredItems = (backendItems ?? localMenuItems).filter(item => {
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory

    // Logic to match all types if the filter is hidden (Desserts/Beverages/Kids)
    // For 'All' category, only show all types if no specific type is selected, otherwise filter by selected type
    const matchType = hideTypeFilter
      ? true
      : selectedCategory === 'All' && normalizedSelectedType === 'all'
        ? true
        : item.type.toLowerCase().replace('-', '') === normalizedSelectedType.replace('-', '')
    
    const matchPrice = selectedPrice === 'All Prices' ||
      (selectedPrice === 'Under ₹200' && item.price < 200) ||
      (selectedPrice === '₹200–₹400' && item.price >= 200 && item.price <= 400) ||
      (selectedPrice === '₹400+' && item.price > 400)
      
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRequestedItem = !requestedItem || item.name.toLowerCase() === requestedItem.toLowerCase()
    return matchCategory && matchType && matchPrice && matchSearch && matchRequestedItem
  })

  // Group items by category for display when 'All' is selected
  // Choose source: backend items (if loaded) otherwise localMenuItems
  const sourceItems = backendItems ?? localMenuItems

  const groupedItems =
    selectedCategory === 'All'
      ? sourceItems.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = []
          acc[item.category].push(item)
          return acc
        }, {} as Record<string, MenuItem[]>)
      : {}

  const handleAddToCart = (item: MenuItem) => {
    const spiceLevel = getActiveSpiceLevel(item.id)
    addToCart(item, spiceLevel)
  }

  const handleSpiceLevelChange = (itemId: number, spiceLevel: 'mild' | 'medium' | 'hot') => {
    const currentSpice = getActiveSpiceLevel(itemId)
    setSelectedSpiceLevels(prev => ({
      ...prev,
      [itemId]: spiceLevel
    }))

    if (cart.some(cartItem => cartItem.id === itemId && cartItem.spiceLevel === currentSpice)) {
      updateSpiceLevel(itemId, currentSpice, spiceLevel)
    }
  }

  // Track cart changes to ensure real-time updates across pages
  // The cart from context automatically triggers re-renders, but we ensure
  // all cart-dependent calculations are fresh on each render

  const renderItem = (item: MenuItem) => {
    // Always get fresh cart state to ensure real-time updates when cart changes
    const activeSpice = getActiveSpiceLevel(item.id)
    // Find cart item matching both id and spice level for accurate quantity display
    const cartItem = cart.find(cartItem => 
      cartItem.id === item.id && cartItem.spiceLevel === activeSpice
    )
    const quantity = cartItem ? cartItem.quantity : 0

    return (
      <div key={item.id} className="col-12 col-sm-6 col-lg-4">
        <div
          className="card border-0 shadow-sm position-relative"
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            background: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Image */}
          <div className="position-relative">
            <img
              src={item.image}
              className="card-img-top"
              alt={item.name}
              style={{
                height: '200px',
                width: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                const target = e.currentTarget
                target.onerror = null
                target.src = '/assets/images/no-dishes.png'
              }}
            />
            <div className="position-absolute top-0 end-0 p-2">
              {item.type === 'veg' && <span className="badge bg-success">🥦 Veg</span>}
              {item.type === 'nonveg' && <span className="badge bg-danger">🍗 Non-Veg</span>}
            </div>
          </div>

          {/* Content */}
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="card-title fw-bold text-dark mb-0" style={{ fontSize: '16px' }}>
                {item.name}
              </h6>
              <div className="d-flex gap-1">
                {(item.category === 'Starters' || item.category === 'Main Course') && (
                  <span
                    className={`badge ${
                      item.spiceLevel === 'hot'
                        ? 'bg-danger'
                        : item.spiceLevel === 'medium'
                        ? 'bg-warning'
                        : 'bg-success'
                    } text-white`}
                    style={{ fontSize: '10px' }}
                  >
                    {item.spiceLevel}
                  </span>
                )}
              </div>
            </div>

            <p className="card-text text-muted small mb-3" style={{ fontSize: '13px', lineHeight: '1.3' }}>
              {item.description}
            </p>

            <div className="d-flex justify-content-between align-items-center">
              <span
                className="fw-bold"
                style={{
                  fontSize: '16px',
                  background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ₹{item.price.toFixed(2)}
              </span>

              <div className="d-flex align-items-center gap-2">
                {(item.category === 'Starters' || item.category === 'Main Course') && (
                  <div className="d-flex gap-1">
                    {(['mild', 'medium', 'hot'] as const).map(spice => {
                      const isSelected = activeSpice === spice
                      return (
                      <button
                        key={spice}
                        className={`btn btn-xs rounded-pill px-2 py-1 ${
                          isSelected ? 'text-white' : 'btn-outline-secondary'
                        }`}
                        style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          background:
                            isSelected
                              ? 'linear-gradient(90deg, #FF6A00, #FF9900)'
                              : undefined,
                          border: 'none',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => handleSpiceLevelChange(item.id, spice)}
                        >
                          {spice.charAt(0).toUpperCase() + spice.slice(1)}
                        </button>
                      )
                    })}
                  </div>
                )}

                {quantity > 0 && (
                  <div className="d-flex align-items-center ms-2">
                    <div
                      className="d-flex align-items-center rounded-pill px-2 py-1"
                      style={{
                        background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
                        border: '2px solid #FF6A00',
                        minWidth: '80px',
                        justifyContent: 'space-between'
                      }}
                    >
                      <button
                        className="btn btn-xs fw-bold p-0"
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: 'none',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px'
                        }}
                        onClick={() => {
                          const spiceLevel = activeSpice
                          const cartItem = cart.find(ci => ci.id === item.id && ci.spiceLevel === spiceLevel)
                          if (cartItem) {
                            updateQuantity(cartItem.id, quantity - 1)
                          }
                        }}
                        tabIndex={0}
                        onFocus={(e) => e.currentTarget.style.outline = '2px solid #fff'}
                        onBlur={(e) => e.currentTarget.style.outline = 'none'}
                      >
                        <FaMinus />
                      </button>
                      <span
                        className="fw-bold text-white"
                        style={{
                          fontSize: '14px',
                          minWidth: '20px',
                          textAlign: 'center'
                        }}
                      >
                        {quantity}
                      </span>
                      <button
                        className="btn btn-xs fw-bold p-0"
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: 'none',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px'
                        }}
                        onClick={() => handleAddToCart(item)}
                        tabIndex={0}
                        onFocus={(e) => e.currentTarget.style.outline = '2px solid #fff'}
                        onBlur={(e) => e.currentTarget.style.outline = 'none'}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                )}

                {quantity === 0 && (
                  <button
                    className="btn btn-sm rounded-pill px-3 py-2 fw-semibold ms-2"
                    style={{
                      background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
                      color: 'white',
                      border: 'none',
                      fontSize: '13px'
                    }}
                    onClick={() => handleAddToCart(item)}
                  >
                    <FaPlus className="me-1" />
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="container py-5"
      style={{
        background: 'linear-gradient(to bottom, #fffaf4, #fff3e0)',
        minHeight: '100vh'
      }}
    >
      <div className="row mb-3">
        <div className="col-12">
          <Link
            to="/category"
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            ←
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center">
          {/* 🔍 Search Bar */}
          <div className="d-flex justify-content-center mb-4">
            <input
              type="text"
              className="form-control w-75 w-md-50"
              placeholder="Search for an item..."
              value={searchQuery}
              onChange={e => {
                const value = e.target.value
                setSearchQuery(value)
                if (!value) {
                  setRequestedItem(null)
                }
              }}
              style={{
                borderRadius: '50px',
                padding: '12px 20px',
                border: '2px solid #FF6A00',
                outline: 'none',
                maxWidth: '500px',
                background: 'white',
                color: '#333',
                boxShadow: '0 4px 15px rgba(255, 106, 0, 0.3)'
              }}
            />
          </div>

          {/* Filter Bar */}
          <div className="d-flex flex-column align-items-center mb-5 gap-3">
            <div
              className="d-flex gap-2 overflow-auto pb-2 px-2"
              style={{
                maxWidth: '100%',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Veg/Non-Veg buttons are displayed/hidden based on selectedCategory */}
              {!hideTypeFilter && (
                <>
                  <button
                    type="button"
                    className={`btn ${
                      selectedType === 'veg' ? 'text-white shadow-sm' : 'btn-outline-secondary'
                    } px-3 py-2 px-md-4 py-md-2 rounded-pill fw-semibold d-flex align-items-center gap-2 flex-shrink-0`}
                    onClick={() => setSelectedType('veg')}
                    style={{
                      transition: 'all 0.2s ease',
                      background:
                        selectedType === 'veg'
                          ? 'linear-gradient(90deg, #28a745, #20c997)'
                          : undefined,
                      border: 'none',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}
                  >
                    🥦 Veg
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      selectedType === 'nonveg' ? 'text-white shadow-sm' : 'btn-outline-secondary'
                    } px-3 py-2 px-md-4 py-md-2 rounded-pill fw-semibold d-flex align-items-center gap-2 flex-shrink-0`}
                    onClick={() => setSelectedType('nonveg')}
                    style={{
                      transition: 'all 0.2s ease',
                      background:
                        selectedType === 'nonveg'
                          ? 'linear-gradient(90deg, #dc3545, #fd7e14)'
                          : undefined,
                      border: 'none',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}
                  >
                    🍗 Non-Veg
                  </button>
                </>
              )}
            </div>
            {/* Price Filter */}
            <div className="d-flex justify-content-center gap-1 gap-md-2 overflow-auto pb-2 px-2" style={{
              maxWidth: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
              {['All Prices', 'Under ₹200', '₹200–₹400', '₹400+'].map(price => (
                <button
                  key={price}
                  className={`btn rounded-pill px-2 px-md-4 py-2 fw-semibold flex-shrink-0 ${
                    selectedPrice === price ? 'text-white' : 'btn-outline-secondary'
                  }`}
                  style={selectedPrice === price ? {
                    background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    fontSize: '12px'
                  } : { whiteSpace: 'nowrap', fontSize: '12px' }}
                  onClick={() => setSelectedPrice(price)}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🍽 Menu Items */}
      {selectedCategory === 'All' ? (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-5">
            <h3
              className="text-center mb-4 fw-bold"
              style={{
                background: 'linear-gradient(90deg, #FF6A00, #FF9900)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {category}
            </h3>
            <div className="row g-3 g-md-4">{items.map(item => renderItem(item))}</div>
          </div>
        ))
      ) : (
        <div className="row g-3 g-md-4">
          {filteredItems.map(item => renderItem(item))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-5">
          <div className="text-center p-4">
            <img src="/assets/images/no-dishes.png" alt="No dishes found" style={{ width: '230px' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu