import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

function Setup() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Setup Guide</h1>
        <p className="mt-1 text-gray-600">Get started with your grocery price tracker</p>
      </div>

      {/* Status Check */}
      <div className="card bg-primary-50">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            {import.meta.env.VITE_GOOGLE_API_KEY ? (
              <>
                <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                <span>Google API Key configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-danger-500 mr-2" />
                <span>Google API Key not configured</span>
              </>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            {import.meta.env.VITE_SPREADSHEET_ID ? (
              <>
                <CheckCircle className="w-5 h-5 text-success-500 mr-2" />
                <span>Spreadsheet ID configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-danger-500 mr-2" />
                <span>Spreadsheet ID not configured</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">1. Create Google Sheet</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex">
            <span className="font-semibold mr-2">a.</span>
            <span>Go to <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Sheets</a></span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">b.</span>
            <span>Create a new blank spreadsheet</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">c.</span>
            <span>Name it "Grocery Price Tracker"</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">d.</span>
            <span>Create the following sheets:</span>
          </li>
          <ul className="ml-8 mt-2 space-y-1 text-sm">
            <li>• Weekly Entries</li>
            <li>• Store Analysis</li>
            <li>• Line Items</li>
            <li>• Item Analysis</li>
            <li>• Contributors Summary</li>
          </ul>
        </ol>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">2. Set Up Sheet Headers</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Weekly Entries (Row 1):</h3>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono">
              Date | User Name | Store Name | Total Cost | Number of Items | Avg Cost Per Item | Notes
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Line Items (Row 1):</h3>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono">
              Date | User Name | Store Name | Item Name | Price | Quantity | Unit | Price Per Unit | Category
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-warning-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> The other sheets (Store Analysis, Item Analysis, Contributors Summary)
            are calculated by the app and don't need data entry.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">3. Get Google API Key</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex">
            <span className="font-semibold mr-2">a.</span>
            <div>
              <span>Go to </span>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline inline-flex items-center"
              >
                Google Cloud Console
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">b.</span>
            <span>Create a new project or select an existing one</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">c.</span>
            <span>Enable the Google Sheets API</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">d.</span>
            <span>Create credentials → API Key</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">e.</span>
            <span>Copy the API key</span>
          </li>
        </ol>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">4. Make Sheet Public</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex">
            <span className="font-semibold mr-2">a.</span>
            <span>In your Google Sheet, click the "Share" button</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">b.</span>
            <span>Under "General access", select "Anyone with the link"</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">c.</span>
            <span>Set permission to "Viewer"</span>
          </li>
          <li className="flex">
            <span className="font-semibold mr-2">d.</span>
            <span>Copy the Spreadsheet ID from the URL:</span>
          </li>
          <div className="ml-8 mt-2 bg-gray-50 p-3 rounded text-sm font-mono break-all">
            https://docs.google.com/spreadsheets/d/<span className="text-primary-600 font-bold">SPREADSHEET_ID</span>/edit
          </div>
        </ol>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">5. Configure Environment Variables</h2>
        <p className="text-gray-700 mb-4">
          Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the root of your project:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
          <div>VITE_GOOGLE_API_KEY=your_api_key_here</div>
          <div>VITE_SPREADSHEET_ID=your_spreadsheet_id_here</div>
        </div>
      </div>

      <div className="card bg-success-50">
        <h2 className="text-xl font-semibold mb-4">6. Start Tracking!</h2>
        <p className="text-gray-700 mb-4">
          You're all set! You can now:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2 flex-shrink-0" />
            <span>Add weekly grocery entries</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2 flex-shrink-0" />
            <span>Track specific item prices</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2 flex-shrink-0" />
            <span>Compare stores and find the best deals</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2 flex-shrink-0" />
            <span>View contributor statistics</span>
          </li>
        </ul>
      </div>

      {/* Troubleshooting */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Can't fetch data?</h3>
            <p className="text-sm text-gray-600">
              Make sure your Google Sheet is set to "Anyone with the link" can view,
              and that the Google Sheets API is enabled in your Google Cloud project.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1">API key issues?</h3>
            <p className="text-sm text-gray-600">
              Verify that your API key has access to the Google Sheets API and that there
              are no restrictions blocking your domain.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Data not appearing?</h3>
            <p className="text-sm text-gray-600">
              Check that sheet names match exactly (case-sensitive), and that headers
              are in row 1 of each sheet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setup
