const {
  getTopWhaleAddresses,
  fetchWhaleTransactions,
} = require("../services/bitqueryService");

/**
 * GET /api/transactions
 * Fetches and returns the latest whale transactions.
 */
async function getTransactions(req, res) {
  try {
    const whaleAddresses = await getTopWhaleAddresses();
    const transactions = await fetchWhaleTransactions(whaleAddresses);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error in getTransactions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getTransactions };
