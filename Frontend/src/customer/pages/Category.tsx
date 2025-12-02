import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaLeaf, FaDrumstickBite } from 'react-icons/fa'
import { menuItems } from '../../data/menuItems'
import './Category.css'

const Category: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedPrice, setSelectedPrice] = useState<string>('All Prices')
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const navigate = useNavigate()

  const getFilteredItems = () => {
    return menuItems.filter(item => {
      const matchesType = selectedType === 'All' || 
        (selectedType === 'Veg' && item.type === 'veg') ||
        (selectedType === 'Non-Veg' && item.type === 'nonveg')
      const matchesPrice = selectedPrice === 'All Prices' ||
        (selectedPrice === 'Under ₹200' && item.price < 200) ||
        (selectedPrice === '₹200–₹400' && item.price >= 200 && item.price <= 400) ||
        (selectedPrice === '₹400+' && item.price > 400)
      return matchesType && matchesPrice
    })
  }

  const filteredItems = getFilteredItems()

  const categories = [
    { name: 'All Items', icon: '🍽️', count: filteredItems.length },
    { name: 'Starters', icon: '🥗', count: filteredItems.filter(item => item.category === 'Starters').length },
    { name: 'Main Course', icon: '🥘', count: filteredItems.filter(item => item.category === 'Main Course').length },
    { name: 'Kids', icon: '👶', count: filteredItems.filter(item => item.category === 'Kids').length },
    { name: 'Desserts', icon: '🍰', count: filteredItems.filter(item => item.category === 'Desserts').length },
    { name: 'Beverages', icon: '🥤', count: filteredItems.filter(item => item.category === 'Beverages').length }
  ]

  const filteredCategories = categories

  const filteredMenuItems = searchQuery.trim()
    ? getFilteredItems().filter(item =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : []

  const handleDishClick = (item: any) => {
    localStorage.setItem('selectedType', 'all')
    setSelectedType('All')
    setIsTypeSelected(false)
    // Keep search query to maintain search results visibility
    // setSearchQuery('')
    navigate(`/menu?category=${encodeURIComponent(item.category)}&item=${encodeURIComponent(item.name)}&type=all&search=${encodeURIComponent(item.name)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredMenuItems.length > 0) handleDishClick(filteredMenuItems[0])
    }
  }

  // Handle type selection filters
  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    setIsTypeSelected(true);

    if (type === 'Veg') {
      localStorage.setItem('selectedType', 'Veg');
    } else if (type === 'Non-Veg') {
      localStorage.setItem('selectedType', 'Non-Veg');
    } else {
      localStorage.setItem('selectedType', 'All');
      setIsTypeSelected(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
      {/* 🔍 Search Bar */}
      <div className="row justify-content-center mb-4 position-relative">
        <div className="col-12 col-md-8 col-lg-6">
          <div
            className="d-flex align-items-center bg-white shadow"
            style={{
              borderRadius: '30px',
              padding: '8px 15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 2
            }}
          >
            <FaSearch className="text-muted me-2 fs-5" />
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                borderRadius: '30px',
                boxShadow: 'none',
                padding: '10px 5px',
                fontSize: '16px',
              }}
            />
          </div>

          {/* ▼ Dish dropdown */}
          {searchQuery.trim() && (
            <div
              className="bg-white shadow-sm rounded mt-2 position-absolute w-100"
              style={{ zIndex: 3, maxHeight: '300px', overflowY: 'auto' }}
            >
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.slice(0, 10).map((dish) => (
                  <div
                    key={dish.id ?? dish.name}
                    className="d-flex align-items-center p-3 border-bottom search-result-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDishClick(dish)}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      width="50"
                      height="50"
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginRight: '10px',
                      }}
                    />
                    <div className="search-result-details">
                      <h6>{dish.name}</h6>
                      <p>₹{dish.price}</p>
                      <p>{dish.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <img
                    src="/assets/images/no-dishes.png"
                    alt="No dishes found"
                    style={{ width: '230px' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="d-flex flex-wrap justify-content-center gap-1 mb-3">
            {['All', 'Veg', 'Non-Veg'].map(type => (
              <button
                key={type}
                className={`btn rounded-pill px-4 py-2 fw-semibold ${
                  selectedType === type ? 'text-white' : 'btn-outline-secondary'
                }`}
                style={selectedType === type ? {
                  background: 'linear-gradient(90deg, #FFA500, #FF6B00)',
                  border: 'none'
                } : {}}
                onClick={() => handleTypeSelection(type)}
              >
                {type === 'Veg' && <FaLeaf className="me-2" />}
                {type === 'Non-Veg' && <FaDrumstickBite className="me-2" />}
                {type}
              </button>
            ))}
          </div>

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

      {/* Category Cards */}
      <div className="row g-4 justify-content-center">
        {filteredCategories.map(category => (
          <div key={category.name} className="col-12 col-sm-6 col-md-3 col-lg-2">
            <Link
              to={
                category.name === 'All Items'
                  ? `/menu?type=${localStorage.getItem('selectedType') || 'all'}&category=All`
                  : category.name === 'Desserts' || category.name === 'Beverages' || category.name === 'Kids'
                    ? `/menu?type=all&category=${encodeURIComponent(category.name)}`
                    : isTypeSelected
                      ? `/menu?type=${localStorage.getItem('selectedType')}&category=${encodeURIComponent(category.name)}`
                      : ''
              }
              onClick={(e) => {
                // Only block navigation if it's not "All Items", "Desserts", "Beverages" or "Kids"
                if (
                  category.name !== 'All Items' &&
                  category.name !== 'Desserts' &&
                  category.name !== 'Beverages' &&
                  category.name !== 'Kids' &&
                  !isTypeSelected
                ) {
                  e.preventDefault()
                  alert('Please select Veg or Non-Veg first!')
                }
              }}
              className="text-decoration-none"
            >
              <div
                className="card h-100 border-0 shadow-sm text-center position-relative overflow-hidden"
                style={{
                  borderRadius: '20px',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  const target = e.currentTarget as HTMLElement
                  target.style.transform = 'translateY(-5px)'
                  target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  const target = e.currentTarget as HTMLElement
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="card-body d-flex flex-column justify-content-center p-2 p-md-4">
                  <div className="d-none d-sm-block" style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>
                    {category.icon}
                  </div>

                  <h5 className="card-title fw-bold text-dark mb-1 mb-md-2">{category.name}</h5>
                  <p className="text-muted mb-0">{category.count} items</p>
                </div>

                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,165,0,0.9), rgba(255,107,0,0.9))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    borderRadius: '20px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '0'}
                >
                  <span className="text-white fw-bold fs-5">Explore →</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .row.justify-content-center.position-relative > .col-12.col-md-8.col-lg-6 {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .row.justify-content-center.position-relative .position-absolute.w-100 {
          top: 100% !important;
          transform: none !important;
          display: block !important;
        }
        .search-result-item h6 {
            margin-bottom: 0.2rem;
            font-size: 16px;
        }
        .search-result-item p {
            margin-bottom: 0;
            font-size: 13px;
            color: #6c757d;
        }
        .search-result-item img {
          width: 80px !important;
          height: 80px !important;
          border-radius: 10px;
          object-fit: cover;
          margin: 0 10px 0 0;
        }
      `}</style>
    </div>
  )
}

export default Category