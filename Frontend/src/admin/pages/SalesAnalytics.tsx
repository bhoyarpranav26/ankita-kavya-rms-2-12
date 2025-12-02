import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { FaChartBar, FaChartPie } from 'react-icons/fa'
import { orders } from '../../data/orders'
import { menuItems } from '../../data/menuItems'
import AdminLayout from '../components/AdminLayout'
 
const SalesAnalytics: React.FC = () => {
  const navigate = useNavigate()
  const [revenueView, setRevenueView] = useState<'daily' | 'weekly' | 'monthly'>('daily')
 
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    if (!isAuthenticated) navigate('/admin')
  }, [navigate])
 
  // Mock daily revenue data
  const dailyRevenue = [
    { label: 'Mon', revenue: 245.5 },
    { label: 'Tue', revenue: 312.75 },
    { label: 'Wed', revenue: 198.25 },
    { label: 'Thu', revenue: 456.8 },
    { label: 'Fri', revenue: 523.9 },
    { label: 'Sat', revenue: 678.45 },
    { label: 'Sun', revenue: 389.2 }
  ]
 
  // Mock weekly revenue data
  const weeklyRevenue = [
    { label: 'Week 1', revenue: 2280.4 },
    { label: 'Week 2', revenue: 3160.7 },
    { label: 'Week 3', revenue: 2987.5 },
    { label: 'Week 4', revenue: 3675.9 }
  ]
 
  // Mock monthly revenue data
  const monthlyRevenue = [
    { label: 'Jan', revenue: 12000 },
    { label: 'Feb', revenue: 13500 },
    { label: 'Mar', revenue: 15000 },
    { label: 'Apr', revenue: 14200 },
    { label: 'May', revenue: 15800 },
    { label: 'Jun', revenue: 16600 },
    { label: 'Jul', revenue: 17250 },
    { label: 'Aug', revenue: 14900 },
    { label: 'Sep', revenue: 16000 },
    { label: 'Oct', revenue: 17800 },
    { label: 'Nov', revenue: 18500 },
    { label: 'Dec', revenue: 19200 }
  ]
 
  // Calculate top-selling items
  const itemSales = orders
    .flatMap(order => order.items)
    .reduce((acc, item) => {
      const existing = acc.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        acc.push({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        })
      }
      return acc
    }, [] as Array<{ id: number; name: string; quantity: number; revenue: number }>)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
 
  // Calculate category distribution
  const categoryData = menuItems.reduce((acc, item) => {
    const category = acc.find(c => c.name === item.category)
    if (category) {
      category.value += 1
    } else {
      acc.push({ name: item.category, value: 1 })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)
 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560']
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = totalRevenue / orders.length
 
  // Select chart data
  const chartData =
    revenueView === 'daily'
      ? dailyRevenue
      : revenueView === 'weekly'
      ? weeklyRevenue
      : monthlyRevenue
 
  return (
    <AdminLayout title="Sales Analytics">
      <div
        className="container-fluid px-3 px-md-4 py-4"
        style={{
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h1 className="display-6 fw-bold text-primary text-center text-md-start mb-3 mb-md-0">
              Sales Analytics
            </h1>
 
            {/* Dropdown for Revenue View */}
            <select
              className="form-select w-auto shadow-sm"
              value={revenueView}
              onChange={(e) =>
                setRevenueView(e.target.value as 'daily' | 'weekly' | 'monthly')
              }
            >
              <option value="daily">Daily Revenue</option>
              <option value="weekly">Weekly Revenue</option>
              <option value="monthly">Monthly Revenue</option>
            </select>
          </div>
        </div>
 
        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4 col-sm-6">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <span
                  className="text-success fs-1 mb-3"
                  style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
                >
                  ₹
                </span>
                <h3 className="fw-bold text-success">
                  ₹{totalRevenue.toFixed(2)}
                </h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>
 
          <div className="col-md-4 col-sm-6">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <FaChartBar className="text-primary fs-1 mb-3" />
                <h3 className="fw-bold text-primary">
                  ₹{averageOrderValue.toFixed(2)}
                </h3>
                <p className="text-muted mb-0">Average Order Value</p>
              </div>
            </div>
          </div>
 
          <div className="col-md-4 col-sm-12">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <FaChartPie className="text-info fs-1 mb-3" />
                <h3 className="fw-bold text-info">{orders.length}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>
        </div>
 
        {/* Charts */}
        <div className="row g-4 mb-5">
          {/* Revenue Chart */}
          <div className="col-lg-8 col-12">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {revenueView === 'daily'
                    ? 'Daily Revenue (Last 7 Days)'
                    : revenueView === 'weekly'
                    ? 'Weekly Revenue (Last 4 Weeks)'
                    : 'Monthly Revenue (Last 12 Months)'}
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`₹${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#0d6efd" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
 
          {/* Category Pie Chart */}
         <div className="col-lg-4 col-12">
  <div className="card shadow-sm border-0 h-100">
    <div className="card-header bg-primary text-white">
      <h5 className="mb-0">Menu Categories</h5>
    </div>
    <div
      className="card-body d-flex justify-content-center align-items-center"
      style={{ minHeight: '320px' }}
    >
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
              const RADIAN = Math.PI / 180
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)
              return (
                <text
                  x={x}
                  y={y}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {name}
                </text>
              )
            }}
            outerRadius={100}
            dataKey="value"
          >
            {categoryData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
 
 
        </div>
 
        {/* Top Selling Items */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Top Selling Items</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Rank</th>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemSales.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <span
                              className={`badge ${
                                index === 0
                                  ? 'bg-warning text-dark'
                                  : index === 1
                                  ? 'bg-secondary'
                                  : 'bg-light text-dark'
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </td>
                          <td className="fw-semibold">{item.name}</td>
                          <td>{item.quantity}</td>
                          <td className="text-success fw-bold">
                            ₹{item.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
 
export default SalesAnalytics