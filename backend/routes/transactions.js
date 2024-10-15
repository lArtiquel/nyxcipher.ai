const express = require("express");
const router = express.Router();
const { getTransactions } = require("../controllers/TransactionsController");

// GET /api/transactions
router.get("/", getTransactions);

module.exports = router;
