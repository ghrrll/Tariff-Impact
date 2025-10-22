import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { addWeeklyEntry } from '../services/googleSheets'

function AddEntry() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [formData, setFormData] = useState({
    userName: '',
    storeName: '',
    totalCost: '',
    numItems: '',
    notes: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const result = await addWeeklyEntry({
        userName: formData.userName,
        storeName: formData.storeName,
        totalCost: parseFloat(formData.totalCost),
        numItems: parseInt(formData.numItems),
        notes: formData.notes
      })

      setMessage({
        type: 'success',
        text: `Entry added successfully! Avg cost per item: $${result.avgCost.toFixed(2)}`
      })

      // Reset form
      setFormData({
        userName: '',
        storeName: '',
        totalCost: '',
        numItems: '',
        notes: ''
      })

      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Weekly Entry</h1>
        <p className="text-gray-600 mb-6">
          Track your weekly grocery shopping trip
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Name */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              required
              className="input"
              value={formData.userName}
              onChange={handleChange}
              placeholder="e.g., John Smith"
            />
          </div>

          {/* Store Name */}
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
              Store Name *
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              required
              className="input"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="e.g., Walmart, Kroger, Publix"
            />
            <p className="mt-1 text-sm text-gray-500">Use consistent names for accurate tracking</p>
          </div>

          {/* Total Cost */}
          <div>
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-2">
              Total Cost ($) *
            </label>
            <input
              type="number"
              step="0.01"
              id="totalCost"
              name="totalCost"
              required
              className="input"
              value={formData.totalCost}
              onChange={handleChange}
              placeholder="125.50"
            />
          </div>

          {/* Number of Items */}
          <div>
            <label htmlFor="numItems" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Items *
            </label>
            <input
              type="number"
              id="numItems"
              name="numItems"
              required
              className="input"
              value={formData.numItems}
              onChange={handleChange}
              placeholder="25"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="input"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Weekly shopping, had coupons, big sale on produce"
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-start space-x-3 ${
              message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p>{message.text}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Adding...' : 'Add Entry'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Quick Stats */}
      {formData.totalCost && formData.numItems && (
        <div className="card mt-6 bg-primary-50">
          <h3 className="font-semibold text-lg mb-2">Quick Calculation</h3>
          <p className="text-2xl font-bold text-primary-700">
            ${(parseFloat(formData.totalCost) / parseInt(formData.numItems)).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Average cost per item</p>
        </div>
      )}
    </div>
  )
}

export default AddEntry
