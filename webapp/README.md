# Grocery Price Tracker - Web App

A modern, responsive web application for collaborative grocery price tracking. Uses Google Sheets as the database backend for simplicity and ease of sharing.

## Features

### 📊 Dashboard
- Overview statistics (total entries, contributors, average costs)
- Interactive charts showing store comparisons
- Recent entries table
- Contributor distribution visualization

### ➕ Data Entry
- **Weekly Entry**: Quick form to log total shopping trips
- **Line Item Tracking**: Detailed product-level price tracking
- Auto-calculated average costs and price per unit
- Form validation and success feedback

### 📈 Analytics & Insights
- **Store Analysis**: Compare stores by average cost per item with charts
- **Item Analysis**: Find the cheapest store for specific products
- **Contributors Dashboard**: See who's contributing data with rankings
- Real-time filtering and search capabilities

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean, intuitive interface with Tailwind CSS
- Interactive charts using Recharts
- Fast loading with optimized React components

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Database**: Google Sheets (via Sheets API v4)
- **Date Handling**: date-fns

## Quick Start

### 1. Prerequisites

- Node.js 16+ and npm/yarn
- A Google account
- Google Sheets API key

### 2. Installation

```bash
# Clone the repository
cd webapp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Google Sheets Setup

#### Create Your Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Grocery Price Tracker"
3. Create the following sheets with headers:

**Weekly Entries:**
```
Date | User Name | Store Name | Total Cost | Number of Items | Avg Cost Per Item | Notes
```

**Line Items:**
```
Date | User Name | Store Name | Item Name | Price | Quantity | Unit | Price Per Unit | Category
```

**Note**: Store Analysis, Item Analysis, and Contributors Summary sheets are calculated by the app.

#### Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Sheets API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy the API key

#### Make Sheet Public

1. Open your Google Sheet
2. Click **Share** button
3. Under "General access", select **Anyone with the link**
4. Set permission to **Viewer**
5. Copy the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 4. Configure Environment

Edit `.env` file:

```env
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
```

### 5. Run the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_GOOGLE_API_KEY`
- `VITE_SPREADSHEET_ID`

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Add environment variables in Netlify dashboard.

### Other Platforms

Build the app:
```bash
npm run build
```

Deploy the `dist` folder to any static hosting service (GitHub Pages, Firebase Hosting, AWS S3, etc.)

## Usage Guide

### Adding Data

1. **Weekly Entry**:
   - Click "Add Entry" in navigation
   - Fill in your name, store, total cost, and item count
   - The app calculates average cost per item automatically
   - Submit to save to Google Sheets

2. **Line Item**:
   - Click "Add Item" in navigation
   - Enter product details (name, price, quantity, category)
   - Optionally add unit for price comparisons
   - Submit to track specific item prices

### Viewing Analytics

- **Dashboard**: Overview of all your data with charts
- **Stores**: Compare stores and find the cheapest
- **Items**: Find best prices for specific products
- **Contributors**: See who's contributing data

### Sharing with Others

1. Share the web app URL with family/roommates
2. Share your Google Sheet in "Editor" mode if they want direct access
3. Everyone uses the same spreadsheet as the database
4. All analytics update in real-time

## Architecture

```
webapp/
├── src/
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── AddEntry.jsx
│   │   ├── AddLineItem.jsx
│   │   ├── StoreAnalysis.jsx
│   │   ├── ItemAnalysis.jsx
│   │   ├── Contributors.jsx
│   │   └── Setup.jsx
│   ├── services/       # Google Sheets API integration
│   │   └── googleSheets.js
│   ├── App.jsx         # Main app with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Tailwind CSS
├── public/             # Static assets
├── .env.example        # Environment template
└── package.json        # Dependencies
```

## Google Sheets as Database

### Why Google Sheets?

- ✅ **No database setup** required
- ✅ **Easy sharing** - just share the sheet
- ✅ **Free** - no hosting costs for data
- ✅ **Familiar interface** - everyone knows spreadsheets
- ✅ **Backup built-in** - Google's infrastructure
- ✅ **Direct access** - view/edit data in sheets if needed

### How It Works

1. Web app reads from Google Sheets using Sheets API v4
2. All data writes go directly to the sheet
3. Analytics are calculated client-side in the browser
4. No separate backend server needed

### Data Flow

```
User Input → React Form → Google Sheets API → Google Sheet
User Views → React App → Google Sheets API → Data Display + Charts
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Fast loading with Vite build optimization
- Client-side caching for repeated data fetching
- Optimized React components with proper memoization
- Lazy loading for charts

## Troubleshooting

### API Key Issues

**Problem**: "Failed to fetch data"
**Solution**:
- Verify API key is correct in `.env`
- Ensure Google Sheets API is enabled in Cloud Console
- Check API key restrictions (if any)

### Spreadsheet Access

**Problem**: "Permission denied"
**Solution**:
- Make sure sheet is set to "Anyone with the link" can view
- Verify Spreadsheet ID is correct
- Check sheet names match exactly (case-sensitive)

### Data Not Showing

**Problem**: Empty tables/charts
**Solution**:
- Ensure headers are in row 1 of each sheet
- Add some sample data to test
- Check browser console for errors
- Verify environment variables are loaded

### Build Errors

**Problem**: Build fails
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Customization

### Changing Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      success: { /* your colors */ },
      // ...
    }
  }
}
```

### Adding Categories

Edit `src/pages/AddLineItem.jsx`:
```javascript
const CATEGORIES = [
  'Dairy',
  'Meat',
  // Add your categories here
]
```

### Modifying Charts

Charts use Recharts. Edit components in `src/pages/` to customize:
- Chart types (Bar, Line, Pie, Area, etc.)
- Colors and styling
- Tooltips and legends
- Data presentation

## Security Notes

- API key is public (client-side) - this is normal for Sheets API
- Use API key restrictions in Google Cloud Console:
  - Restrict to HTTP referrers (your domain)
  - Or restrict to Sheets API only
- Keep spreadsheet in "Viewer" mode for public access
- Don't store sensitive data in the sheet

## Contributing

Feel free to fork and customize for your needs! Some ideas:
- Add receipt photo uploads
- Integrate with store APIs
- Add price alerts/notifications
- Export data to CSV
- Multi-currency support
- Shopping list integration

## License

MIT License - use freely!

## Support

- Check the Setup page in the app for detailed instructions
- Review troubleshooting section above
- Check browser console for error messages

---

Built with ❤️ using React and Google Sheets
