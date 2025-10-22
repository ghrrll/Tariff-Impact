import { useState, useEffect } from 'react'
import { Trophy, Award, Star } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateContributorsSummary } from '../services/googleSheets'
import { format } from 'date-fns'

const COLORS = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#00bcd4']

function Contributors() {
  const [loading, setLoading] = useState(true)
  const [contributors, setContributors] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const data = await calculateContributorsSummary()
      setContributors(data)
    } catch (error) {
      console.error('Error loading contributors:', error)
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

  const chartData = contributors.map(contrib => ({
    name: contrib.userName,
    value: contrib.totalContributions
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contributors</h1>
          <p className="mt-1 text-gray-600">See who's helping track prices</p>
        </div>
        <button onClick={loadData} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Top 3 Contributors */}
      {contributors.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gold - #1 */}
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-12 h-12 text-yellow-600" />
              <span className="text-4xl font-bold text-yellow-600">#1</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{contributors[0].userName}</h3>
            <p className="text-3xl font-bold text-yellow-700 mb-2">
              {contributors[0].totalContributions}
            </p>
            <p className="text-sm text-gray-600">Total Contributions</p>
          </div>

          {/* Silver - #2 */}
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-12 h-12 text-gray-600" />
              <span className="text-4xl font-bold text-gray-600">#2</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{contributors[1].userName}</h3>
            <p className="text-3xl font-bold text-gray-700 mb-2">
              {contributors[1].totalContributions}
            </p>
            <p className="text-sm text-gray-600">Total Contributions</p>
          </div>

          {/* Bronze - #3 */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-12 h-12 text-orange-600" />
              <span className="text-4xl font-bold text-orange-600">#3</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{contributors[2].userName}</h3>
            <p className="text-3xl font-bold text-orange-700 mb-2">
              {contributors[2].totalContributions}
            </p>
            <p className="text-sm text-gray-600">Total Contributions</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Contribution Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly Entries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Line Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Cost/Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tracked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favorite Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Entry
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributors.map((contrib, index) => (
                <tr
                  key={contrib.userName}
                  className={index === 0 ? 'bg-success-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-600 mr-2" />}
                      {index === 1 && <Award className="w-5 h-5 text-gray-600 mr-2" />}
                      {index === 2 && <Star className="w-5 h-5 text-orange-600 mr-2" />}
                      <span className="font-medium">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{contrib.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {contrib.weeklyEntries}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {contrib.lineItems}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-primary-600">
                      {contrib.totalContributions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contrib.avgCostPerItem > 0 ? `$${contrib.avgCostPerItem.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contrib.totalAmount > 0 ? `$${contrib.totalAmount.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contrib.mostFrequentStore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contrib.lastDate ? format(new Date(contrib.lastDate), 'MMM d, yyyy') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="card bg-primary-50">
        <h3 className="font-semibold mb-2">Why Contributors Matter</h3>
        <p className="text-sm text-gray-700">
          Our collaborative tracking works best with multiple contributors. More data points mean
          more accurate price comparisons and better insights for everyone. Thank you to all contributors
          for making this possible!
        </p>
      </div>
    </div>
  )
}

export default Contributors
