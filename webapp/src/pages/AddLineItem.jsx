import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { addLineItem } from '../services/googleSheets'

const CATEGORIES = [
  'Dairy',
  'Meat',
  'Produce',
  'Bakery',
  'Pantry',
  'Frozen',
  'Beverages',
  'Snacks',
  'Household',
  'Other'
]

function AddLineItem() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [formData, setFormData] = useState({
    userName: '',
    storeName: '',
    itemName: '',
    price: '',
    quantity: '1',
    unit: '',
    category: ''
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
      const result = await addLineItem({
        userName: formData.userName,
        storeName: formData.storeName,
        itemName: formData.itemName,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category
      })

      const msg = `Item added successfully!${
        result.pricePerUnit ? ` Price per ${formData.unit || 'unit'}: $${result.pricePerUnit.toFixed(2)}` : ''
      }`

      setMessage({
        type: 'success',
        text: msg
      })

      // Reset form
      setFormData({
        userName: '',
        storeName: '',
        itemName: '',
        price: '',
        quantity: '1',
        unit: '',
        category: ''
      })

      // Navigate to items page after 2 seconds
      setTimeout(() => {
        navigate('/items')
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

  const pricePerUnit = formData.price && formData.quantity
    ? (parseFloat(formData.price) / parseFloat(formData.quantity)).toFixed(2)
    : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Line Item</h1>
        <p className="text-gray-600 mb-6">
          Track specific product prices for detailed analysis
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
          </div>

          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              required
              className="input"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Whole Milk, White Bread, Dozen Eggs"
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                required
                className="input"
                value={formData.price}
                onChange={handleChange}
                placeholder="3.99"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                step="0.01"
                id="quantity"
                name="quantity"
                required
                className="input"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="1"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
              Unit (optional)
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              className="input"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., gallon, lb, oz, each"
            />
            <p className="mt-1 text-sm text-gray-500">Helps compare unit prices across stores</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="input"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
              {loading ? 'Adding...' : 'Add Item'}
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
      {pricePerUnit && (
        <div className="card mt-6 bg-primary-50">
          <h3 className="font-semibold text-lg mb-2">Price Per Unit</h3>
          <p className="text-2xl font-bold text-primary-700">
            ${pricePerUnit}{formData.unit ? ` / ${formData.unit}` : ''}
          </p>
          <p className="text-sm text-gray-600">
            {formData.quantity} {formData.unit} @ ${formData.price}
          </p>
        </div>
      )}
    </div>
  )
}

export default AddLineItem
