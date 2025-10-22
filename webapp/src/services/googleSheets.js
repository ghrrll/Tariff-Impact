/**
 * Google Sheets API Service
 * Handles all interactions with Google Sheets API
 */

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID

const SHEETS = {
  WEEKLY_ENTRIES: 'Weekly Entries',
  STORE_ANALYSIS: 'Store Analysis',
  LINE_ITEMS: 'Line Items',
  ITEM_ANALYSIS: 'Item Analysis',
  CONTRIBUTORS: 'Contributors Summary'
}

/**
 * Fetch data from a specific sheet
 */
export async function fetchSheetData(sheetName, range = 'A1:Z1000') {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    throw error
  }
}

/**
 * Append a row to a specific sheet
 */
export async function appendRow(sheetName, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values]
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to append row: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error appending row:', error)
    throw error
  }
}

/**
 * Fetch weekly entries
 */
export async function fetchWeeklyEntries() {
  const data = await fetchSheetData(SHEETS.WEEKLY_ENTRIES)
  if (data.length <= 1) return [] // Only headers

  const headers = data[0]
  const rows = data.slice(1)

  return rows.map(row => ({
    date: row[0],
    userName: row[1],
    storeName: row[2],
    totalCost: parseFloat(row[3]) || 0,
    numItems: parseInt(row[4]) || 0,
    avgCostPerItem: parseFloat(row[5]) || 0,
    notes: row[6] || ''
  }))
}

/**
 * Add a weekly entry
 */
export async function addWeeklyEntry(entry) {
  const avgCost = entry.totalCost / entry.numItems

  const row = [
    new Date().toISOString(),
    entry.userName,
    entry.storeName,
    entry.totalCost,
    entry.numItems,
    avgCost,
    entry.notes || ''
  ]

  await appendRow(SHEETS.WEEKLY_ENTRIES, row)
  return { success: true, avgCost }
}

/**
 * Fetch line items
 */
export async function fetchLineItems() {
  const data = await fetchSheetData(SHEETS.LINE_ITEMS)
  if (data.length <= 1) return []

  const rows = data.slice(1)

  return rows.map(row => ({
    date: row[0],
    userName: row[1],
    storeName: row[2],
    itemName: row[3],
    price: parseFloat(row[4]) || 0,
    quantity: parseFloat(row[5]) || 0,
    unit: row[6] || '',
    pricePerUnit: parseFloat(row[7]) || 0,
    category: row[8] || ''
  }))
}

/**
 * Add a line item
 */
export async function addLineItem(item) {
  const pricePerUnit = item.quantity > 0 ? item.price / item.quantity : 0

  const row = [
    new Date().toISOString(),
    item.userName,
    item.storeName,
    item.itemName,
    item.price,
    item.quantity,
    item.unit || '',
    pricePerUnit,
    item.category
  ]

  await appendRow(SHEETS.LINE_ITEMS, row)
  return { success: true, pricePerUnit }
}

/**
 * Calculate store analysis from weekly entries
 */
export async function calculateStoreAnalysis() {
  const entries = await fetchWeeklyEntries()

  const storeStats = {}

  entries.forEach(entry => {
    if (!entry.storeName || !entry.totalCost || !entry.numItems) return

    if (!storeStats[entry.storeName]) {
      storeStats[entry.storeName] = {
        storeName: entry.storeName,
        totalEntries: 0,
        totalItems: 0,
        totalSpent: 0,
        avgCosts: [],
        contributors: new Set(),
        lowest: Infinity,
        highest: -Infinity
      }
    }

    const stats = storeStats[entry.storeName]
    stats.totalEntries++
    stats.totalItems += entry.numItems
    stats.totalSpent += entry.totalCost
    stats.avgCosts.push(entry.avgCostPerItem)
    stats.lowest = Math.min(stats.lowest, entry.avgCostPerItem)
    stats.highest = Math.max(stats.highest, entry.avgCostPerItem)
    if (entry.userName) stats.contributors.add(entry.userName)
  })

  // Calculate averages and format
  const results = Object.values(storeStats).map(stats => ({
    storeName: stats.storeName,
    totalEntries: stats.totalEntries,
    contributors: Array.from(stats.contributors).join(', '),
    totalItems: stats.totalItems,
    totalSpent: stats.totalSpent,
    avgCostPerItem: stats.avgCosts.reduce((a, b) => a + b, 0) / stats.avgCosts.length,
    lowest: stats.lowest,
    highest: stats.highest
  }))

  // Sort by average cost per item (cheapest first)
  results.sort((a, b) => a.avgCostPerItem - b.avgCostPerItem)

  return results.map((r, index) => ({ ...r, rank: index + 1 }))
}

/**
 * Calculate item analysis from line items
 */
export async function calculateItemAnalysis() {
  const items = await fetchLineItems()

  const itemStats = {}

  items.forEach(item => {
    if (!item.itemName || !item.price) return

    if (!itemStats[item.itemName]) {
      itemStats[item.itemName] = {
        itemName: item.itemName,
        category: item.category || 'Unknown',
        prices: [],
        entries: 0,
        contributors: new Set()
      }
    }

    const stats = itemStats[item.itemName]
    stats.entries++
    stats.prices.push({
      storeName: item.storeName,
      price: item.price
    })
    if (item.userName) stats.contributors.add(item.userName)
  })

  // Calculate statistics
  const results = Object.values(itemStats).map(stats => {
    const prices = stats.prices.map(p => p.price)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

    const sortedByPrice = [...stats.prices].sort((a, b) => a.price - b.price)
    const cheapest = sortedByPrice[0]
    const mostExpensive = sortedByPrice[sortedByPrice.length - 1]

    return {
      itemName: stats.itemName,
      category: stats.category,
      cheapestStore: cheapest.storeName,
      cheapestPrice: cheapest.price,
      expensiveStore: mostExpensive.storeName,
      expensivePrice: mostExpensive.price,
      avgPrice,
      totalEntries: stats.entries,
      contributors: Array.from(stats.contributors).join(', '),
      priceRange: mostExpensive.price - cheapest.price
    }
  })

  // Sort by item name
  results.sort((a, b) => a.itemName.localeCompare(b.itemName))

  return results
}

/**
 * Calculate contributors summary
 */
export async function calculateContributorsSummary() {
  const weeklyEntries = await fetchWeeklyEntries()
  const lineItems = await fetchLineItems()

  const contributorStats = {}

  // Process weekly entries
  weeklyEntries.forEach(entry => {
    if (!entry.userName) return

    if (!contributorStats[entry.userName]) {
      contributorStats[entry.userName] = {
        userName: entry.userName,
        weeklyEntries: 0,
        lineItems: 0,
        totalAmount: 0,
        avgCosts: [],
        stores: {},
        lastDate: null
      }
    }

    const stats = contributorStats[entry.userName]
    stats.weeklyEntries++
    if (entry.totalCost) stats.totalAmount += entry.totalCost
    if (entry.avgCostPerItem) stats.avgCosts.push(entry.avgCostPerItem)
    if (entry.storeName) {
      stats.stores[entry.storeName] = (stats.stores[entry.storeName] || 0) + 1
    }
    if (entry.date) {
      const entryDate = new Date(entry.date)
      if (!stats.lastDate || entryDate > stats.lastDate) {
        stats.lastDate = entryDate
      }
    }
  })

  // Process line items
  lineItems.forEach(item => {
    if (!item.userName) return

    if (!contributorStats[item.userName]) {
      contributorStats[item.userName] = {
        userName: item.userName,
        weeklyEntries: 0,
        lineItems: 0,
        totalAmount: 0,
        avgCosts: [],
        stores: {},
        lastDate: null
      }
    }

    const stats = contributorStats[item.userName]
    stats.lineItems++
    if (item.storeName) {
      stats.stores[item.storeName] = (stats.stores[item.storeName] || 0) + 1
    }
    if (item.date) {
      const entryDate = new Date(item.date)
      if (!stats.lastDate || entryDate > stats.lastDate) {
        stats.lastDate = entryDate
      }
    }
  })

  // Calculate final statistics
  const results = Object.values(contributorStats).map(stats => {
    const avgCostPerItem = stats.avgCosts.length > 0
      ? stats.avgCosts.reduce((a, b) => a + b, 0) / stats.avgCosts.length
      : 0

    // Find most frequent store
    let mostFrequentStore = '-'
    let maxCount = 0
    Object.entries(stats.stores).forEach(([store, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostFrequentStore = store
      }
    })

    return {
      userName: stats.userName,
      weeklyEntries: stats.weeklyEntries,
      lineItems: stats.lineItems,
      totalContributions: stats.weeklyEntries + stats.lineItems,
      avgCostPerItem,
      totalAmount: stats.totalAmount,
      mostFrequentStore,
      lastDate: stats.lastDate
    }
  })

  // Sort by total contributions (most active first)
  results.sort((a, b) => b.totalContributions - a.totalContributions)

  return results
}

export { SHEETS }
