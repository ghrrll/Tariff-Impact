import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ShoppingCart, PlusCircle, BarChart3, Users, Settings, TrendingUp } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import AddEntry from './pages/AddEntry'
import AddLineItem from './pages/AddLineItem'
import StoreAnalysis from './pages/StoreAnalysis'
import ItemAnalysis from './pages/ItemAnalysis'
import Contributors from './pages/Contributors'
import Setup from './pages/Setup'

function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/add-entry', icon: PlusCircle, label: 'Add Entry' },
    { path: '/add-item', icon: ShoppingCart, label: 'Add Item' },
    { path: '/stores', icon: TrendingUp, label: 'Stores' },
    { path: '/items', icon: ShoppingCart, label: 'Items' },
    { path: '/contributors', icon: Users, label: 'Contributors' },
    { path: '/setup', icon: Settings, label: 'Setup' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600">
              <ShoppingCart className="w-8 h-8" />
              <span>Grocery Tracker</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              className="text-gray-700 hover:text-gray-900"
              onClick={() => {/* Toggle mobile menu */}}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-entry" element={<AddEntry />} />
            <Route path="/add-item" element={<AddLineItem />} />
            <Route path="/stores" element={<StoreAnalysis />} />
            <Route path="/items" element={<ItemAnalysis />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
            <p>Collaborative Grocery Price Tracker &copy; 2025</p>
            <p className="mt-1">Using Google Sheets as your database</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
