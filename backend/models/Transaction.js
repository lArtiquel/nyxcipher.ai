const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  hash: String,
  amount: Number,
  sender: String,
  receiver: String,
  blockHeight: Number,
});

module.exports = mongoose.model("Transaction", transactionSchema);
