export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: Array<{
    id: number
    name: string
    quantity: number
    price: number
    spiceLevel?: 'Mild' | 'Medium' | 'Hot'
  }>
  total: number
  status: 'Pending' | 'Preparing' | 'Served'
  orderTime: string
  deliveryAddress: string
}

export const orders: Order[] = [
  {
    id: 'FF1A2B3C4D',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { id: 1, name: 'Chicken Wings', quantity: 2, price: 12.99, spiceLevel: 'Hot' },
      { id: 5, name: 'Beef Burger', quantity: 1, price: 16.99, spiceLevel: 'Medium' }
    ],
    total: 42.97,
    status: 'Pending',
    orderTime: '2024-01-15T10:30:00Z',
    deliveryAddress: '123 Main St, City, State 12345'
  },
  {
    id: 'FF5E6F7G8H',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { id: 4, name: 'Grilled Salmon', quantity: 1, price: 24.99 },
      { id: 8, name: 'Chocolate Cake', quantity: 1, price: 7.99 }
    ],
    total: 32.98,
    status: 'Preparing',
    orderTime: '2024-01-15T11:15:00Z',
    deliveryAddress: '456 Oak Ave, City, State 12345'
  },
  {
    id: 'FF9I0J1K2L',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    items: [
      { id: 6, name: 'Chicken Alfredo', quantity: 1, price: 18.99 },
      { id: 11, name: 'Fresh Orange Juice', quantity: 2, price: 4.99 }
    ],
    total: 28.97,
    status: 'Served',
    orderTime: '2024-01-15T09:45:00Z',
    deliveryAddress: '789 Pine Rd, City, State 12345'
  },
  {
    id: 'FF3M4N5O6P',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    items: [
      { id: 2, name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { id: 12, name: 'Cappuccino', quantity: 1, price: 5.99 }
    ],
    total: 14.98,
    status: 'Pending',
    orderTime: '2024-01-15T12:00:00Z',
    deliveryAddress: '321 Elm St, City, State 12345'
  }
]