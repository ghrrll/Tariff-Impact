import { useState, useEffect } from 'react'
import { TrendingDown, TrendingUp, ShoppingCart, Users, DollarSign, Package } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateStoreAnalysis, calculateItemAnalysis, calculateContributorsSummary, fetchWeeklyEntries } from '../services/googleSheets'

const COLORS = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#00bcd4', '#ff9800']

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalContributors: 0,
    avgCostPerItem: 0,
    cheapestStore: '-',
    totalStores: 0,
    totalItems: 0
  })
  const [storeData, setStoreData] = useState([])
  const [recentEntries, setRecentEntries] = useState([])
  const [contributorData, setContributorData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [stores, items, contributors, weeklyEntries] = await Promise.all([
        calculateStoreAnalysis(),
        calculateItemAnalysis(),
        calculateContributorsSummary(),
        fetchWeeklyEntries()
      ])

      // Calculate overall stats
      const avgCost = stores.length > 0
        ? stores.reduce((sum, store) => sum + store.avgCostPerItem, 0) / stores.length
        : 0

      setStats({
        totalEntries: weeklyEntries.length,
        totalContributors: contributors.length,
        avgCostPerItem: avgCost,
        cheapestStore: stores.length > 0 ? stores[0].storeName : '-',
        totalStores: stores.length,
        totalItems: items.length
      })

      // Prepare chart data
      setStoreData(stores.slice(0, 5).map(store => ({
        name: store.storeName,
        avgCost: parseFloat(store.avgCostPerItem.toFixed(2)),
        entries: store.totalEntries
      })))

      setContributorData(contributors.slice(0, 5).map(contrib => ({
        name: contrib.userName,
        contributions: contrib.totalContributions
      })))

      setRecentEntries(weeklyEntries.slice(-5).reverse())

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your grocery price tracking</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <ShoppingCart className="w-8 h-8 text-primary-500" />
            <span className="text-3xl font-bold">{stats.totalEntries}</span>
          </div>
          <p className="text-gray-600">Total Entries</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <Users className="w-8 h-8 text-success-500" />
            <span className="text-3xl font-bold">{stats.totalContributors}</span>
          </div>
          <p className="text-gray-600">Contributors</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <DollarSign className="w-8 h-8 text-warning-500" />
            <span className="text-3xl font-bold">${stats.avgCostPerItem.toFixed(2)}</span>
          </div>
          <p className="text-gray-600">Avg Cost Per Item</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <TrendingDown className="w-8 h-8 text-success-500" />
            <span className="text-xl font-bold">{stats.cheapestStore}</span>
          </div>
          <p className="text-gray-600">Cheapest Store</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <Package className="w-8 h-8 text-primary-500" />
            <span className="text-3xl font-bold">{stats.totalStores}</span>
          </div>
          <p className="text-gray-600">Stores Tracked</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between w-full mb-2">
            <ShoppingCart className="w-8 h-8 text-warning-500" />
            <span className="text-3xl font-bold">{stats.totalItems}</span>
          </div>
          <p className="text-gray-600">Line Items</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Comparison */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Store Price Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgCost" fill="#4285f4" name="Avg Cost Per Item ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Contributors */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contributorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, contributions }) => `${name}: ${contributions}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="contributions"
              >
                {contributorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Per Item
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentEntries.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.storeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.numItems}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${entry.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${entry.avgCostPerItem.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={loadData}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  )
}

export default Dashboard
