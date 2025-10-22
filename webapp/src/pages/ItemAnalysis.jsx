import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateItemAnalysis } from '../services/googleSheets'

function ItemAnalysis() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterItems()
  }, [searchTerm, selectedCategory, items])

  async function loadData() {
    try {
      setLoading(true)
      const data = await calculateItemAnalysis()
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error('Error loading item analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterItems() {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }

  const categories = ['All', ...new Set(items.map(item => item.category))]

  const chartData = filteredItems.slice(0, 10).map(item => ({
    name: item.itemName.length > 15 ? item.itemName.substring(0, 15) + '...' : item.itemName,
    cheapest: item.cheapestPrice,
    expensive: item.expensivePrice,
    average: parseFloat(item.avgPrice.toFixed(2))
  }))

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Item Analysis</h1>
          <p className="mt-1 text-gray-600">Find the best prices for specific items</p>
        </div>
        <button onClick={loadData} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Chart */}
      {filteredItems.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Price Comparison (Top 10 Items)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cheapest" fill="#34a853" name="Cheapest Price ($)" />
              <Bar dataKey="average" fill="#4285f4" name="Average Price ($)" />
              <Bar dataKey="expensive" fill="#ea4335" name="Most Expensive ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Item Price Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cheapest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Most Expensive
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributors
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.itemName} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">
                    {item.itemName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-bold text-success-600">${item.cheapestPrice.toFixed(2)}</div>
                      <div className="text-gray-500">{item.cheapestStore}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-bold text-danger-600">${item.expensivePrice.toFixed(2)}</div>
                      <div className="text-gray-500">{item.expensiveStore}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-primary-600">
                    ${item.avgPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-success-600 font-semibold">
                      ${item.priceRange.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {item.contributors}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold mb-2">Shopping Tip</h3>
        <p className="text-sm text-gray-700">
          <strong>Savings:</strong> Shows the price difference between cheapest and most expensive stores.
          Shop at the "Cheapest" store for each item to maximize savings!
        </p>
      </div>
    </div>
  )
}

export default ItemAnalysis
