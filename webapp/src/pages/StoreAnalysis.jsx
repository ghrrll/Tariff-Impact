import { useState, useEffect } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateStoreAnalysis } from '../services/googleSheets'

function StoreAnalysis() {
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const data = await calculateStoreAnalysis()
      setStores(data)
    } catch (error) {
      console.error('Error loading store analysis:', error)
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

  const chartData = stores.map(store => ({
    name: store.storeName,
    avgCost: parseFloat(store.avgCostPerItem.toFixed(2)),
    totalSpent: store.totalSpent
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Analysis</h1>
          <p className="mt-1 text-gray-600">Compare stores by average cost per item</p>
        </div>
        <button onClick={loadData} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Average Cost Per Item</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgCost" fill="#4285f4" name="Avg Cost Per Item ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Store Rankings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Cost/Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store, index) => (
                <tr
                  key={store.storeName}
                  className={
                    index === 0
                      ? 'bg-success-50'
                      : index === stores.length - 1
                      ? 'bg-danger-50'
                      : ''
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <TrendingDown className="w-5 h-5 text-success-600 mr-2" />
                      ) : index === stores.length - 1 ? (
                        <TrendingUp className="w-5 h-5 text-danger-600 mr-2" />
                      ) : null}
                      <span className="font-medium">{store.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {store.storeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-primary-600">
                    ${store.avgCostPerItem.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {store.totalEntries}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {store.contributors}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${store.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${store.lowest.toFixed(2)} - ${store.highest.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold mb-2">How to Read This</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <div className="w-4 h-4 bg-success-50 border border-success-200 rounded mr-2"></div>
            <span><strong>Green highlight:</strong> Cheapest store overall</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 bg-danger-50 border border-danger-200 rounded mr-2"></div>
            <span><strong>Red highlight:</strong> Most expensive store overall</span>
          </li>
          <li><strong>Avg Cost/Item:</strong> Average cost per item across all shopping trips</li>
          <li><strong>Range:</strong> Lowest to highest average cost per item recorded</li>
          <li><strong>Contributors:</strong> Who provided data for this store</li>
        </ul>
      </div>
    </div>
  )
}

export default StoreAnalysis
