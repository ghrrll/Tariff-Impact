# Collaborative Grocery Price Tracker

A Google Sheets-based system for tracking grocery prices collaboratively. Multiple users can input their shopping data to identify which stores offer the best prices.

## Features

### Basic Tracking
- **Weekly Entries**: Track total cost, number of items, and store name for each shopping trip
- **Automatic Calculations**: Average cost per item calculated automatically
- **Store Comparison**: See which stores have the lowest average cost per item
- **User-Friendly Forms**: Easy-to-use dialog forms for data entry

### Advanced Features
- **Line Item Tracking**: Track specific products (milk, eggs, bread, etc.)
- **Item Analysis**: Identify the cheapest store for each specific item
- **Category Organization**: Organize items by category (Dairy, Meat, Produce, etc.)
- **Price Per Unit**: Calculate unit prices for better comparison
- **Trend Analysis**: Track price ranges and identify best deals

## Setup Instructions

### 1. Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Grocery Price Tracker"

### 2. Add the Script
1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy all the code from `GroceryPriceTracker.gs`
4. Paste it into the Apps Script editor
5. Click the **Save** icon (or Ctrl/Cmd + S)
6. Name the project "Grocery Price Tracker"

### 3. Initialize the Sheets
1. Close the Apps Script editor and return to your spreadsheet
2. Refresh the page (you may need to wait a few seconds)
3. You should see a new menu: **📊 Grocery Tracker**
4. Click **📊 Grocery Tracker** > **⚙️ Setup Sheets**
5. Click "OK" when prompted about authorization
6. Follow the authorization steps:
   - Click "Advanced"
   - Click "Go to [Your Project Name] (unsafe)" (it's safe - it's your own script)
   - Click "Allow"
7. The script will create all necessary sheets

## How to Use

### Basic Weekly Tracking

This is the simplest way to track prices - just enter your weekly totals.

1. **Add a Weekly Entry**:
   - Click **📊 Grocery Tracker** > **➕ Add Weekly Entry**
   - Fill in the form:
     - Your Name
     - Store Name (e.g., "Walmart", "Kroger", "Publix")
     - Total Cost (e.g., 125.50)
     - Number of Items (e.g., 25)
     - Optional notes (e.g., "Had coupons", "Big sale on meat")
   - Click "Add Entry"

2. **View Store Rankings**:
   - The system automatically updates the **Store Analysis** sheet
   - Shows which stores have the lowest average cost per item
   - Green highlight = Best store
   - Red highlight = Most expensive store

### Advanced Line Item Tracking

Track specific items to see where each product is cheapest.

1. **Add Line Items**:
   - Click **📊 Grocery Tracker** > **🛒 Add Line Item**
   - Fill in the form:
     - Your Name
     - Store Name
     - Item Name (e.g., "Whole Milk", "Dozen Eggs")
     - Price (e.g., 3.99)
     - Quantity (e.g., 1)
     - Unit (optional: "gallon", "dozen", "lb", etc.)
     - Category (Dairy, Meat, Produce, etc.)
   - Click "Add Item"

2. **View Item Analysis**:
   - Check the **Item Analysis** sheet
   - See which store has the cheapest price for each item
   - Compare price ranges across stores
   - Find the best deals on your most-purchased items

### Update Analytics

The system auto-updates when you add entries, but you can manually refresh:
- Click **📊 Grocery Tracker** > **🔄 Update All Analytics**

## Sheet Descriptions

### Weekly Entries
- **Purpose**: Main data entry for weekly shopping trips
- **Columns**:
  - Date: Automatically recorded
  - User Name: Who did the shopping
  - Store Name: Where you shopped
  - Total Cost: Total amount spent
  - Number of Items: Total items purchased
  - Avg Cost Per Item: Automatically calculated
  - Notes: Optional additional information

### Store Analysis
- **Purpose**: Compare stores by average cost per item
- **Key Metrics**:
  - Average Cost Per Item (lower is better)
  - Total entries and items tracked
  - Lowest and highest entries
  - Store ranking

### Line Items
- **Purpose**: Track individual product prices
- **Columns**:
  - Date, User Name, Store Name
  - Item Name, Price, Quantity, Unit
  - Price Per Unit: Automatically calculated
  - Category: Product category

### Item Analysis
- **Purpose**: Find the cheapest store for specific items
- **Key Information**:
  - Cheapest store and price
  - Most expensive store and price
  - Average price across all stores
  - Price range (difference between highest and lowest)

### Setup
- **Purpose**: Instructions and help documentation
- **Content**: How to use the tracker, tips, and best practices

## Tips for Best Results

### Consistency is Key
- **Use consistent store names**: "Walmart" not "walmart" or "Wal-Mart"
- **Standard item names**: "Whole Milk" not "milk whole" or "MILK"
- **Regular updates**: Enter data weekly for best trends

### Data Entry Best Practices
1. **Weekly Tracking**: Enter your total weekly shopping data
2. **Line Items**: Focus on items you buy regularly (staples)
3. **Categories**: Use consistent categories for easier analysis
4. **Notes**: Add context about sales, coupons, or special circumstances

### Getting Useful Insights
- **Need at least 2-3 weeks** of data for meaningful comparisons
- **Multiple users** make the data more reliable
- **Track both** weekly totals AND line items for complete picture
- **Update regularly** to see price trends over time

## Common Use Cases

### Scenario 1: Weekly Grocery Shopping
**Goal**: Find which store is cheapest overall

1. Everyone logs their weekly shopping: total cost and item count
2. Check **Store Analysis** to see rankings
3. The store with lowest "Average Cost Per Item" is generally cheapest

### Scenario 2: Finding Best Deals on Staples
**Goal**: Buy milk, eggs, bread at the best price

1. Multiple people track line items for these products at different stores
2. Check **Item Analysis** sheet
3. See exactly where each item is cheapest
4. Plan shopping: buy milk at Store A, eggs at Store B, etc.

### Scenario 3: Collaborative Family/Roommate Tracking
**Goal**: Share shopping data among household members

1. Each person enters their shopping data using their name
2. Everyone can see which stores are best
3. Make informed decisions about where to shop
4. Track spending patterns over time

## Customization

### Add More Categories
Edit the `showLineItemForm()` function to add custom categories:
```javascript
<option value="Your Category">Your Category</option>
```

### Change Colors
Modify the `CONFIG.COLORS` object at the top of the script:
```javascript
COLORS: {
  HEADER: "#4285f4",  // Header background
  BEST: "#34a853",    // Best store highlight
  WORST: "#ea4335",   // Worst store highlight
  NEUTRAL: "#fbbc04"  // Neutral/middle values
}
```

### Add More Sheets
Follow the pattern in `setupSheets()` to add custom analysis sheets.

## Sharing with Others

### Allow Others to Edit
1. Click **Share** button in Google Sheets
2. Add email addresses of collaborators
3. Set permission to **Editor**
4. They can now add their own data

### View-Only Access
- Set permission to **Viewer** for people who should only see results
- They can view analytics but not add data

## Troubleshooting

### Menu Not Appearing
- Refresh the page
- Wait 30 seconds and refresh again
- Close and reopen the spreadsheet

### Authorization Errors
- Click "Advanced" then "Go to [project name] (unsafe)"
- This is your own script, it's safe
- Grant the necessary permissions

### Calculations Not Updating
- Click **📊 Grocery Tracker** > **🔄 Update All Analytics**
- Check that all required fields are filled in

### Form Not Saving
- Check your internet connection
- Ensure all required fields (marked with *) are filled
- Try closing and reopening the form

## Migration from Old Scraper Script

This new version replaces web scraping with manual data entry because:
1. **More Reliable**: No broken scrapers when websites change
2. **More Flexible**: Track any store, not just specific websites
3. **Collaborative**: Multiple people can contribute data
4. **More Accurate**: Real prices from actual shopping trips
5. **Privacy-Friendly**: No automated web requests

### What Changed
- ❌ Removed: Web scraping functionality
- ❌ Removed: Automated price fetching
- ✅ Added: User-friendly data entry forms
- ✅ Added: Store comparison analytics
- ✅ Added: Line item tracking
- ✅ Added: Multi-user support
- ✅ Improved: Better analysis and insights

## Future Enhancements

Potential additions:
- Weekly/monthly spending reports
- Budget tracking and alerts
- Mobile-friendly data entry
- Automated email summaries
- Price prediction trends
- Integration with receipt scanning apps

## Support

For questions or issues:
1. Check the **Setup** sheet in your spreadsheet for help
2. Review this README
3. Check that all sheets are properly set up
4. Try the "Setup Sheets" menu option again

## License

This script is provided as-is for personal use. Feel free to modify and customize for your needs.
