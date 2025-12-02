import React, { useState } from 'react'
import { FaPlus, FaMinus, FaLeaf } from 'react-icons/fa'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  isNew?: boolean
  isVeg?: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number, spiceLevel: string) => void
  onUpdateQuantity: (itemId: number, quantity: number) => void
  currentQuantity: number
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onUpdateQuantity,
  currentQuantity
}) => {
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot'>('Medium')

  const handleAddToCart = () => {
    onAddToCart(item, 1, selectedSpiceLevel)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onUpdateQuantity(item.id, 0)
    } else {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{
        width: '310px',
        height: '175px',
        margin: '0 auto'
      }}
    >
      <div className="flex h-full">
        {/* Image Section */}
        <div className="relative w-32 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* New Badge */}
          {item.isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              New
            </div>
          )}

          {/* Veg/Non-Veg Icon */}
          <div className="absolute top-2 right-2">
            <FaLeaf
              className={`text-lg ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            {/* Title and Description */}
            <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
              {item.description}
            </p>

            {/* Price */}
            <div className="text-orange-600 font-bold text-sm mb-2">
              ₹{item.price}
            </div>

            {/* Spice Level Buttons */}
            <div className="flex gap-1 mb-2">
              {(['Mild', 'Medium', 'Hot'] as const).map((spice) => (
                <button
                  key={spice}
                  onClick={() => setSelectedSpiceLevel(spice)}
                  className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                    selectedSpiceLevel === spice
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {spice}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart / Quantity Controls */}
          <div className="flex justify-end">
            {currentQuantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:from-orange-500 hover:to-orange-700 transition-all duration-200"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center text-sm hover:from-orange-500 hover:to-orange-700 transition-colors duration-200"
                >
                  <FaMinus />
                </button>
                <span className="font-bold text-sm min-w-[20px] text-center">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center text-sm hover:from-orange-500 hover:to-orange-700 transition-colors duration-200"
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard