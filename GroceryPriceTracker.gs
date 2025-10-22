/**
 * Collaborative Grocery Price Tracker
 * Allows multiple users to track grocery prices and compare stores
 */

const CONFIG = {
  SHEETS: {
    WEEKLY_ENTRIES: "Weekly Entries",
    STORE_ANALYSIS: "Store Analysis",
    LINE_ITEMS: "Line Items",
    ITEM_ANALYSIS: "Item Analysis",
    CONTRIBUTORS: "Contributors Summary",
    SETUP: "Setup"
  },
  COLORS: {
    HEADER: "#4285f4",
    BEST: "#34a853",
    WORST: "#ea4335",
    NEUTRAL: "#fbbc04"
  }
};

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Grocery Tracker')
    .addItem('➕ Add Weekly Entry', 'showWeeklyEntryForm')
    .addItem('🛒 Add Line Item', 'showLineItemForm')
    .addSeparator()
    .addItem('📈 Update Store Analysis', 'updateStoreAnalysis')
    .addItem('📊 Update Item Analysis', 'updateItemAnalysis')
    .addItem('👥 Update Contributors Summary', 'updateContributorsSummary')
    .addItem('🔄 Update All Analytics', 'updateAllAnalytics')
    .addSeparator()
    .addItem('⚙️ Setup Sheets', 'setupSheets')
    .addToUi();
}

/**
 * Initial setup - creates all necessary sheets with proper headers
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Setup Weekly Entries Sheet
  let weeklySheet = ss.getSheetByName(CONFIG.SHEETS.WEEKLY_ENTRIES);
  if (!weeklySheet) {
    weeklySheet = ss.insertSheet(CONFIG.SHEETS.WEEKLY_ENTRIES);
  }
  setupWeeklyEntriesSheet(weeklySheet);

  // Setup Store Analysis Sheet
  let storeSheet = ss.getSheetByName(CONFIG.SHEETS.STORE_ANALYSIS);
  if (!storeSheet) {
    storeSheet = ss.insertSheet(CONFIG.SHEETS.STORE_ANALYSIS);
  }
  setupStoreAnalysisSheet(storeSheet);

  // Setup Line Items Sheet
  let lineItemsSheet = ss.getSheetByName(CONFIG.SHEETS.LINE_ITEMS);
  if (!lineItemsSheet) {
    lineItemsSheet = ss.insertSheet(CONFIG.SHEETS.LINE_ITEMS);
  }
  setupLineItemsSheet(lineItemsSheet);

  // Setup Item Analysis Sheet
  let itemAnalysisSheet = ss.getSheetByName(CONFIG.SHEETS.ITEM_ANALYSIS);
  if (!itemAnalysisSheet) {
    itemAnalysisSheet = ss.insertSheet(CONFIG.SHEETS.ITEM_ANALYSIS);
  }
  setupItemAnalysisSheet(itemAnalysisSheet);

  // Setup Contributors Summary Sheet
  let contributorsSheet = ss.getSheetByName(CONFIG.SHEETS.CONTRIBUTORS);
  if (!contributorsSheet) {
    contributorsSheet = ss.insertSheet(CONFIG.SHEETS.CONTRIBUTORS);
  }
  setupContributorsSheet(contributorsSheet);

  // Setup info/help sheet
  let setupSheet = ss.getSheetByName(CONFIG.SHEETS.SETUP);
  if (!setupSheet) {
    setupSheet = ss.insertSheet(CONFIG.SHEETS.SETUP);
  }
  setupInfoSheet(setupSheet);

  SpreadsheetApp.getUi().alert('Setup Complete!',
    'All sheets have been created and configured. You can now start adding entries!',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Setup Weekly Entries sheet with headers and formatting
 */
function setupWeeklyEntriesSheet(sheet) {
  sheet.clear();

  const headers = [
    'Date',
    'User Name',
    'Store Name',
    'Total Cost',
    'Number of Items',
    'Avg Cost Per Item',
    'Notes'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(CONFIG.COLORS.HEADER)
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 100); // Date
  sheet.setColumnWidth(2, 120); // User Name
  sheet.setColumnWidth(3, 150); // Store Name
  sheet.setColumnWidth(4, 100); // Total Cost
  sheet.setColumnWidth(5, 120); // Number of Items
  sheet.setColumnWidth(6, 130); // Avg Cost Per Item
  sheet.setColumnWidth(7, 200); // Notes

  // Format currency columns
  sheet.getRange(2, 4, 1000, 1).setNumberFormat('$#,##0.00'); // Total Cost
  sheet.getRange(2, 6, 1000, 1).setNumberFormat('$#,##0.00'); // Avg Cost Per Item

  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Setup Store Analysis sheet
 */
function setupStoreAnalysisSheet(sheet) {
  sheet.clear();

  const headers = [
    'Store Name',
    'Total Entries',
    'Contributors',
    'Total Items Bought',
    'Total Spent',
    'Average Cost Per Item',
    'Lowest Entry',
    'Highest Entry',
    'Rank'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(CONFIG.COLORS.HEADER)
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 150);  // Store Name
  sheet.setColumnWidth(2, 100);  // Total Entries
  sheet.setColumnWidth(3, 200);  // Contributors
  sheet.setColumnWidth(4, 130);  // Total Items Bought
  sheet.setColumnWidth(5, 120);  // Total Spent
  sheet.setColumnWidth(6, 150);  // Average Cost Per Item
  sheet.setColumnWidth(7, 120);  // Lowest Entry
  sheet.setColumnWidth(8, 120);  // Highest Entry
  sheet.setColumnWidth(9, 80);   // Rank

  // Format currency columns
  sheet.getRange(2, 5, 1000, 1).setNumberFormat('$#,##0.00'); // Total Spent
  sheet.getRange(2, 6, 1000, 1).setNumberFormat('$#,##0.00'); // Average Cost Per Item
  sheet.getRange(2, 7, 1000, 1).setNumberFormat('$#,##0.00'); // Lowest Entry
  sheet.getRange(2, 8, 1000, 1).setNumberFormat('$#,##0.00'); // Highest Entry

  sheet.setFrozenRows(1);
}

/**
 * Setup Line Items sheet
 */
function setupLineItemsSheet(sheet) {
  sheet.clear();

  const headers = [
    'Date',
    'User Name',
    'Store Name',
    'Item Name',
    'Price',
    'Quantity',
    'Unit (oz, lb, etc)',
    'Price Per Unit',
    'Category'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(CONFIG.COLORS.HEADER)
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 120);

  // Format currency columns
  sheet.getRange(2, 5, 1000, 1).setNumberFormat('$#,##0.00'); // Price
  sheet.getRange(2, 8, 1000, 1).setNumberFormat('$#,##0.00'); // Price Per Unit

  sheet.setFrozenRows(1);
}

/**
 * Setup Item Analysis sheet
 */
function setupItemAnalysisSheet(sheet) {
  sheet.clear();

  const headers = [
    'Item Name',
    'Category',
    'Cheapest Store',
    'Cheapest Price',
    'Most Expensive Store',
    'Most Expensive Price',
    'Average Price',
    'Total Entries',
    'Contributors',
    'Price Range'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(CONFIG.COLORS.HEADER)
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 150);  // Item Name
  sheet.setColumnWidth(2, 120);  // Category
  sheet.setColumnWidth(3, 150);  // Cheapest Store
  sheet.setColumnWidth(4, 120);  // Cheapest Price
  sheet.setColumnWidth(5, 150);  // Most Expensive Store
  sheet.setColumnWidth(6, 120);  // Most Expensive Price
  sheet.setColumnWidth(7, 120);  // Average Price
  sheet.setColumnWidth(8, 100);  // Total Entries
  sheet.setColumnWidth(9, 200);  // Contributors
  sheet.setColumnWidth(10, 120); // Price Range

  // Format currency columns
  sheet.getRange(2, 4, 1000, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 6, 1000, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 7, 1000, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 10, 1000, 1).setNumberFormat('$#,##0.00');

  sheet.setFrozenRows(1);
}

/**
 * Setup Contributors Summary sheet
 */
function setupContributorsSheet(sheet) {
  sheet.clear();

  const headers = [
    'Contributor Name',
    'Total Weekly Entries',
    'Total Line Items',
    'Total Contributions',
    'Avg Cost Per Item',
    'Total Amount Tracked',
    'Most Frequent Store',
    'Last Entry Date'
  ];

  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(CONFIG.COLORS.HEADER)
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 150);  // Contributor Name
  sheet.setColumnWidth(2, 130);  // Total Weekly Entries
  sheet.setColumnWidth(3, 130);  // Total Line Items
  sheet.setColumnWidth(4, 130);  // Total Contributions
  sheet.setColumnWidth(5, 140);  // Avg Cost Per Item
  sheet.setColumnWidth(6, 140);  // Total Amount Tracked
  sheet.setColumnWidth(7, 150);  // Most Frequent Store
  sheet.setColumnWidth(8, 120);  // Last Entry Date

  // Format currency columns
  sheet.getRange(2, 5, 1000, 1).setNumberFormat('$#,##0.00'); // Avg Cost Per Item
  sheet.getRange(2, 6, 1000, 1).setNumberFormat('$#,##0.00'); // Total Amount Tracked

  // Format date column
  sheet.getRange(2, 8, 1000, 1).setNumberFormat('m/d/yyyy');

  sheet.setFrozenRows(1);
}

/**
 * Setup info/help sheet
 */
function setupInfoSheet(sheet) {
  sheet.clear();

  const content = [
    ['Collaborative Grocery Price Tracker', '', ''],
    ['', '', ''],
    ['How to Use:', '', ''],
    ['1. Basic Weekly Tracking:', '', ''],
    ['   - Use "Add Weekly Entry" from the menu', '', ''],
    ['   - Enter your name, store, total cost, and number of items', '', ''],
    ['   - The system automatically calculates average cost per item', '', ''],
    ['', '', ''],
    ['2. Advanced Line Item Tracking:', '', ''],
    ['   - Use "Add Line Item" to track specific products (milk, eggs, etc)', '', ''],
    ['   - This helps identify which store has the best price for specific items', '', ''],
    ['', '', ''],
    ['3. Analytics:', '', ''],
    ['   - Store Analysis: See which stores are cheapest overall', '', ''],
    ['   - Item Analysis: See where to buy specific items', '', ''],
    ['   - Run "Update All Analytics" to refresh all reports', '', ''],
    ['', '', ''],
    ['Tips:', '', ''],
    ['   - Enter data consistently (same store names)', '', ''],
    ['   - Add notes about sales or special circumstances', '', ''],
    ['   - Update analytics regularly to see trends', '', ''],
    ['', '', ''],
    ['Common Categories for Line Items:', '', ''],
    ['   Dairy, Meat, Produce, Bakery, Pantry, Frozen, Beverages, Snacks, Household', '', '']
  ];

  sheet.getRange(1, 1, content.length, 3).setValues(content);
  sheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  sheet.setColumnWidth(1, 400);

  // Color code the sections
  sheet.getRange(3, 1).setBackground(CONFIG.COLORS.HEADER).setFontColor('white').setFontWeight('bold');
  sheet.getRange(4, 1).setBackground('#e8f0fe');
  sheet.getRange(9, 1).setBackground('#e8f0fe');
  sheet.getRange(16, 1).setBackground('#e8f0fe');
  sheet.getRange(21, 1).setBackground('#e8f0fe');
}

/**
 * Show form to add weekly entry
 */
function showWeeklyEntryForm() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 500px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input, textarea, select {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #4285f4;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
          }
          button:hover {
            background-color: #357ae8;
          }
          .cancel-btn {
            background-color: #999;
          }
          .cancel-btn:hover {
            background-color: #777;
          }
          #message {
            margin-top: 15px;
            padding: 10px;
            display: none;
          }
          .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
        </style>
      </head>
      <body>
        <h2>Add Weekly Grocery Entry</h2>
        <form id="entryForm">
          <div class="form-group">
            <label for="userName">Your Name *</label>
            <input type="text" id="userName" required>
          </div>

          <div class="form-group">
            <label for="storeName">Store Name *</label>
            <input type="text" id="storeName" required
                   placeholder="e.g., Walmart, Kroger, Publix">
          </div>

          <div class="form-group">
            <label for="totalCost">Total Cost ($) *</label>
            <input type="number" id="totalCost" step="0.01" required
                   placeholder="125.50">
          </div>

          <div class="form-group">
            <label for="numItems">Number of Items *</label>
            <input type="number" id="numItems" required
                   placeholder="25">
          </div>

          <div class="form-group">
            <label for="notes">Notes (optional)</label>
            <textarea id="notes" rows="3"
                      placeholder="e.g., Weekly shopping, had coupons, big sale on produce"></textarea>
          </div>

          <button type="submit">Add Entry</button>
          <button type="button" class="cancel-btn" onclick="google.script.host.close()">Cancel</button>

          <div id="message"></div>
        </form>

        <script>
          document.getElementById('entryForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const data = {
              userName: document.getElementById('userName').value,
              storeName: document.getElementById('storeName').value,
              totalCost: parseFloat(document.getElementById('totalCost').value),
              numItems: parseInt(document.getElementById('numItems').value),
              notes: document.getElementById('notes').value
            };

            const message = document.getElementById('message');
            message.style.display = 'block';
            message.className = '';
            message.textContent = 'Adding entry...';

            google.script.run
              .withSuccessHandler(function(result) {
                message.className = 'success';
                message.textContent = 'Entry added successfully! Avg cost per item: $' + result.avgCost.toFixed(2);
                document.getElementById('entryForm').reset();
                setTimeout(function() {
                  google.script.host.close();
                }, 2000);
              })
              .withFailureHandler(function(error) {
                message.className = 'error';
                message.textContent = 'Error: ' + error.message;
              })
              .addWeeklyEntry(data);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Add Weekly Entry');
}

/**
 * Add weekly entry to spreadsheet
 */
function addWeeklyEntry(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.WEEKLY_ENTRIES);

  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(CONFIG.SHEETS.WEEKLY_ENTRIES);
  }

  const avgCost = data.totalCost / data.numItems;

  const row = [
    new Date(),
    data.userName,
    data.storeName,
    data.totalCost,
    data.numItems,
    avgCost,
    data.notes || ''
  ];

  sheet.appendRow(row);

  // Auto-update store analysis
  updateStoreAnalysis();

  return { success: true, avgCost: avgCost };
}

/**
 * Show form to add line item
 */
function showLineItemForm() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 500px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input, select {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #4285f4;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
          }
          button:hover {
            background-color: #357ae8;
          }
          .cancel-btn {
            background-color: #999;
          }
          .cancel-btn:hover {
            background-color: #777;
          }
          #message {
            margin-top: 15px;
            padding: 10px;
            display: none;
          }
          .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          .help-text {
            font-size: 12px;
            color: #666;
            margin-top: 3px;
          }
        </style>
      </head>
      <body>
        <h2>Add Line Item (Advanced Tracking)</h2>
        <form id="lineItemForm">
          <div class="form-group">
            <label for="userName">Your Name *</label>
            <input type="text" id="userName" required>
          </div>

          <div class="form-group">
            <label for="storeName">Store Name *</label>
            <input type="text" id="storeName" required>
          </div>

          <div class="form-group">
            <label for="itemName">Item Name *</label>
            <input type="text" id="itemName" required
                   placeholder="e.g., Whole Milk, White Bread, Eggs">
          </div>

          <div class="form-group">
            <label for="price">Price ($) *</label>
            <input type="number" id="price" step="0.01" required
                   placeholder="3.99">
          </div>

          <div class="form-group">
            <label for="quantity">Quantity *</label>
            <input type="number" id="quantity" step="0.01" required value="1">
            <div class="help-text">Numeric value (e.g., 1, 2, 0.5)</div>
          </div>

          <div class="form-group">
            <label for="unit">Unit</label>
            <input type="text" id="unit" placeholder="e.g., gallon, lb, oz, each">
            <div class="help-text">Optional: helps compare unit prices</div>
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" required>
              <option value="">-- Select Category --</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Produce">Produce</option>
              <option value="Bakery">Bakery</option>
              <option value="Pantry">Pantry</option>
              <option value="Frozen">Frozen</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Household">Household</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit">Add Item</button>
          <button type="button" class="cancel-btn" onclick="google.script.host.close()">Cancel</button>

          <div id="message"></div>
        </form>

        <script>
          document.getElementById('lineItemForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const quantity = parseFloat(document.getElementById('quantity').value);
            const price = parseFloat(document.getElementById('price').value);

            const data = {
              userName: document.getElementById('userName').value,
              storeName: document.getElementById('storeName').value,
              itemName: document.getElementById('itemName').value,
              price: price,
              quantity: quantity,
              unit: document.getElementById('unit').value,
              category: document.getElementById('category').value
            };

            const message = document.getElementById('message');
            message.style.display = 'block';
            message.className = '';
            message.textContent = 'Adding item...';

            google.script.run
              .withSuccessHandler(function(result) {
                message.className = 'success';
                let msg = 'Item added successfully!';
                if (result.pricePerUnit) {
                  msg += ' Price per ' + result.unit + ': $' + result.pricePerUnit.toFixed(2);
                }
                message.textContent = msg;
                document.getElementById('lineItemForm').reset();
                setTimeout(function() {
                  google.script.host.close();
                }, 2000);
              })
              .withFailureHandler(function(error) {
                message.className = 'error';
                message.textContent = 'Error: ' + error.message;
              })
              .addLineItem(data);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(html, 'Add Line Item');
}

/**
 * Add line item to spreadsheet
 */
function addLineItem(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.LINE_ITEMS);

  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(CONFIG.SHEETS.LINE_ITEMS);
  }

  let pricePerUnit = null;
  if (data.quantity && data.quantity > 0) {
    pricePerUnit = data.price / data.quantity;
  }

  const row = [
    new Date(),
    data.userName,
    data.storeName,
    data.itemName,
    data.price,
    data.quantity,
    data.unit || '',
    pricePerUnit,
    data.category
  ];

  sheet.appendRow(row);

  // Auto-update item analysis
  updateItemAnalysis();

  return {
    success: true,
    pricePerUnit: pricePerUnit,
    unit: data.unit
  };
}

/**
 * Update store analysis - shows which stores are cheapest
 */
function updateStoreAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const weeklySheet = ss.getSheetByName(CONFIG.SHEETS.WEEKLY_ENTRIES);
  const analysisSheet = ss.getSheetByName(CONFIG.SHEETS.STORE_ANALYSIS);

  if (!weeklySheet || !analysisSheet) {
    SpreadsheetApp.getUi().alert('Please run Setup Sheets first!');
    return;
  }

  const data = weeklySheet.getDataRange().getValues();
  if (data.length <= 1) return; // Only headers

  // Skip header row
  const entries = data.slice(1);

  // Group by store
  const storeStats = {};

  entries.forEach(row => {
    const [date, userName, storeName, totalCost, numItems, avgCost] = row;

    if (!storeName || !totalCost || !numItems) return;

    if (!storeStats[storeName]) {
      storeStats[storeName] = {
        totalEntries: 0,
        totalItems: 0,
        totalSpent: 0,
        avgCosts: [],
        lowest: Infinity,
        highest: -Infinity,
        contributors: new Set()
      };
    }

    storeStats[storeName].totalEntries++;
    storeStats[storeName].totalItems += numItems;
    storeStats[storeName].totalSpent += totalCost;
    storeStats[storeName].avgCosts.push(avgCost);
    storeStats[storeName].lowest = Math.min(storeStats[storeName].lowest, avgCost);
    storeStats[storeName].highest = Math.max(storeStats[storeName].highest, avgCost);
    if (userName) storeStats[storeName].contributors.add(userName);
  });

  // Calculate averages and prepare output
  const results = [];

  for (const [store, stats] of Object.entries(storeStats)) {
    const avgCostPerItem = stats.avgCosts.reduce((a, b) => a + b, 0) / stats.avgCosts.length;
    const contributorsList = Array.from(stats.contributors).join(', ');

    results.push({
      store: store,
      totalEntries: stats.totalEntries,
      contributors: contributorsList,
      totalItems: stats.totalItems,
      totalSpent: stats.totalSpent,
      avgCostPerItem: avgCostPerItem,
      lowest: stats.lowest,
      highest: stats.highest
    });
  }

  // Sort by average cost per item (cheapest first)
  results.sort((a, b) => a.avgCostPerItem - b.avgCostPerItem);

  // Clear existing data (keep headers)
  if (analysisSheet.getLastRow() > 1) {
    analysisSheet.getRange(2, 1, analysisSheet.getLastRow() - 1, 9).clear();
  }

  // Write results
  const outputData = results.map((r, index) => [
    r.store,
    r.totalEntries,
    r.contributors,
    r.totalItems,
    r.totalSpent,
    r.avgCostPerItem,
    r.lowest,
    r.highest,
    index + 1 // Rank
  ]);

  if (outputData.length > 0) {
    analysisSheet.getRange(2, 1, outputData.length, 9).setValues(outputData);

    // Highlight best and worst stores
    if (outputData.length > 0) {
      // Best store (first row) - green
      analysisSheet.getRange(2, 1, 1, 9).setBackground(CONFIG.COLORS.BEST);

      // Worst store (last row) - red
      if (outputData.length > 1) {
        analysisSheet.getRange(outputData.length + 1, 1, 1, 9).setBackground(CONFIG.COLORS.WORST);
      }
    }
  }

  SpreadsheetApp.getUi().alert('Store Analysis Updated!',
    `Analyzed ${results.length} stores. Check the ${CONFIG.SHEETS.STORE_ANALYSIS} sheet for results.`,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Update item analysis - shows best prices for specific items
 */
function updateItemAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lineItemsSheet = ss.getSheetByName(CONFIG.SHEETS.LINE_ITEMS);
  const analysisSheet = ss.getSheetByName(CONFIG.SHEETS.ITEM_ANALYSIS);

  if (!lineItemsSheet || !analysisSheet) {
    SpreadsheetApp.getUi().alert('Please run Setup Sheets first!');
    return;
  }

  const data = lineItemsSheet.getDataRange().getValues();
  if (data.length <= 1) return; // Only headers

  // Skip header row
  const entries = data.slice(1);

  // Group by item name
  const itemStats = {};

  entries.forEach(row => {
    const [date, userName, storeName, itemName, price, quantity, unit, pricePerUnit, category] = row;

    if (!itemName || !price) return;

    if (!itemStats[itemName]) {
      itemStats[itemName] = {
        category: category || 'Unknown',
        prices: [],
        entries: 0,
        contributors: new Set()
      };
    }

    itemStats[itemName].entries++;
    itemStats[itemName].prices.push({
      store: storeName,
      price: price,
      pricePerUnit: pricePerUnit
    });
    if (userName) itemStats[itemName].contributors.add(userName);
  });

  // Calculate statistics for each item
  const results = [];

  for (const [item, stats] of Object.entries(itemStats)) {
    const prices = stats.prices.map(p => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const contributorsList = Array.from(stats.contributors).join(', ');

    // Find cheapest and most expensive
    const sortedByPrice = [...stats.prices].sort((a, b) => a.price - b.price);
    const cheapest = sortedByPrice[0];
    const mostExpensive = sortedByPrice[sortedByPrice.length - 1];

    results.push({
      item: item,
      category: stats.category,
      cheapestStore: cheapest.store,
      cheapestPrice: cheapest.price,
      expensiveStore: mostExpensive.store,
      expensivePrice: mostExpensive.price,
      avgPrice: avgPrice,
      totalEntries: stats.entries,
      contributors: contributorsList,
      priceRange: mostExpensive.price - cheapest.price
    });
  }

  // Sort by item name
  results.sort((a, b) => a.item.localeCompare(b.item));

  // Clear existing data (keep headers)
  if (analysisSheet.getLastRow() > 1) {
    analysisSheet.getRange(2, 1, analysisSheet.getLastRow() - 1, 10).clear();
  }

  // Write results
  const outputData = results.map(r => [
    r.item,
    r.category,
    r.cheapestStore,
    r.cheapestPrice,
    r.expensiveStore,
    r.expensivePrice,
    r.avgPrice,
    r.totalEntries,
    r.contributors,
    r.priceRange
  ]);

  if (outputData.length > 0) {
    analysisSheet.getRange(2, 1, outputData.length, 10).setValues(outputData);

    // Add conditional formatting for price range
    const priceRangeCol = analysisSheet.getRange(2, 10, outputData.length, 1);
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpointWithValue(CONFIG.COLORS.WORST, SpreadsheetApp.InterpolationType.NUMBER, '10')
      .setGradientMidpointWithValue(CONFIG.COLORS.NEUTRAL, SpreadsheetApp.InterpolationType.NUMBER, '5')
      .setGradientMinpointWithValue(CONFIG.COLORS.BEST, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setRanges([priceRangeCol])
      .build();

    const rules = analysisSheet.getConditionalFormatRules();
    rules.push(rule);
    analysisSheet.setConditionalFormatRules(rules);
  }

  SpreadsheetApp.getUi().alert('Item Analysis Updated!',
    `Analyzed ${results.length} items. Check the ${CONFIG.SHEETS.ITEM_ANALYSIS} sheet for results.`,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Update contributors summary - shows statistics per contributor
 */
function updateContributorsSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const weeklySheet = ss.getSheetByName(CONFIG.SHEETS.WEEKLY_ENTRIES);
  const lineItemsSheet = ss.getSheetByName(CONFIG.SHEETS.LINE_ITEMS);
  const contributorsSheet = ss.getSheetByName(CONFIG.SHEETS.CONTRIBUTORS);

  if (!contributorsSheet) {
    SpreadsheetApp.getUi().alert('Please run Setup Sheets first!');
    return;
  }

  const contributorStats = {};

  // Process weekly entries
  if (weeklySheet) {
    const weeklyData = weeklySheet.getDataRange().getValues();
    if (weeklyData.length > 1) {
      const weeklyEntries = weeklyData.slice(1);

      weeklyEntries.forEach(row => {
        const [date, userName, storeName, totalCost, numItems, avgCost] = row;

        if (!userName) return;

        if (!contributorStats[userName]) {
          contributorStats[userName] = {
            weeklyEntries: 0,
            lineItems: 0,
            totalContributions: 0,
            totalAmount: 0,
            avgCosts: [],
            stores: {},
            lastDate: null
          };
        }

        contributorStats[userName].weeklyEntries++;
        contributorStats[userName].totalContributions++;
        if (totalCost) contributorStats[userName].totalAmount += totalCost;
        if (avgCost) contributorStats[userName].avgCosts.push(avgCost);
        if (storeName) {
          contributorStats[userName].stores[storeName] = (contributorStats[userName].stores[storeName] || 0) + 1;
        }
        if (date) {
          const entryDate = new Date(date);
          if (!contributorStats[userName].lastDate || entryDate > contributorStats[userName].lastDate) {
            contributorStats[userName].lastDate = entryDate;
          }
        }
      });
    }
  }

  // Process line items
  if (lineItemsSheet) {
    const lineItemsData = lineItemsSheet.getDataRange().getValues();
    if (lineItemsData.length > 1) {
      const lineItemsEntries = lineItemsData.slice(1);

      lineItemsEntries.forEach(row => {
        const [date, userName, storeName] = row;

        if (!userName) return;

        if (!contributorStats[userName]) {
          contributorStats[userName] = {
            weeklyEntries: 0,
            lineItems: 0,
            totalContributions: 0,
            totalAmount: 0,
            avgCosts: [],
            stores: {},
            lastDate: null
          };
        }

        contributorStats[userName].lineItems++;
        contributorStats[userName].totalContributions++;
        if (storeName) {
          contributorStats[userName].stores[storeName] = (contributorStats[userName].stores[storeName] || 0) + 1;
        }
        if (date) {
          const entryDate = new Date(date);
          if (!contributorStats[userName].lastDate || entryDate > contributorStats[userName].lastDate) {
            contributorStats[userName].lastDate = entryDate;
          }
        }
      });
    }
  }

  // Calculate statistics and prepare output
  const results = [];

  for (const [userName, stats] of Object.entries(contributorStats)) {
    const avgCostPerItem = stats.avgCosts.length > 0
      ? stats.avgCosts.reduce((a, b) => a + b, 0) / stats.avgCosts.length
      : 0;

    // Find most frequent store
    let mostFrequentStore = '-';
    let maxCount = 0;
    for (const [store, count] of Object.entries(stats.stores)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentStore = store;
      }
    }

    results.push({
      userName: userName,
      weeklyEntries: stats.weeklyEntries,
      lineItems: stats.lineItems,
      totalContributions: stats.totalContributions,
      avgCostPerItem: avgCostPerItem,
      totalAmount: stats.totalAmount,
      mostFrequentStore: mostFrequentStore,
      lastDate: stats.lastDate || new Date()
    });
  }

  // Sort by total contributions (most active first)
  results.sort((a, b) => b.totalContributions - a.totalContributions);

  // Clear existing data (keep headers)
  if (contributorsSheet.getLastRow() > 1) {
    contributorsSheet.getRange(2, 1, contributorsSheet.getLastRow() - 1, 8).clear();
  }

  // Write results
  const outputData = results.map(r => [
    r.userName,
    r.weeklyEntries,
    r.lineItems,
    r.totalContributions,
    r.avgCostPerItem,
    r.totalAmount,
    r.mostFrequentStore,
    r.lastDate
  ]);

  if (outputData.length > 0) {
    contributorsSheet.getRange(2, 1, outputData.length, 8).setValues(outputData);

    // Highlight top contributor
    if (outputData.length > 0) {
      contributorsSheet.getRange(2, 1, 1, 8).setBackground(CONFIG.COLORS.BEST);
    }
  }

  SpreadsheetApp.getUi().alert('Contributors Summary Updated!',
    `Analyzed ${results.length} contributors. Check the ${CONFIG.SHEETS.CONTRIBUTORS} sheet for results.`,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Update all analytics at once
 */
function updateAllAnalytics() {
  updateStoreAnalysis();
  updateItemAnalysis();
  updateContributorsSummary();

  SpreadsheetApp.getUi().alert('All Analytics Updated!',
    'Store analysis, item analysis, and contributors summary have been refreshed.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}
