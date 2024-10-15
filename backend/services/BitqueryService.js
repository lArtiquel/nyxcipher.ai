require("dotenv").config();
const axios = require("axios");

/**
 * Fetch the top N whale addresses on the Binance Smart Chain (BSC) network.
 * @param {number} limit - Number of top addresses to fetch.
 * @returns {Promise<string[]>} Array of whale addresses.
 */
async function getTopWhaleAddresses(limit = 10) {
  console.log("Fetching top whale addresses for BSC network...");

  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const query = `
    query getWhales($network: evm_network!, $tokenSmartContract: String!, $limit: Int!, $date: String!) {
      EVM(dataset: archive, network: $network) {
        TokenHolders(
          date: $date
          where: {
            Balance: { Amount: { ge: "4000" } },
            Currency: { Name: {} }
          }
          limit: { count: $limit }
          orderBy: { descending: Balance_Amount }
          tokenSmartContract: $tokenSmartContract
        ) {
          Balance {
            Amount
          }
          Holder {
            Address
          }
        }
      }
    }
  `;

  const variables = {
    network: "bsc",
    tokenSmartContract: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // BNB
    limit: limit,
    date: currentDate,
  };

  try {
    const response = await axios.post(
      "https://streaming.bitquery.io/graphql",
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.BITQUERY_API_KEY,
        },
      }
    );

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      console.error("❌ API errors:", errors);
      return [];
    }

    const holders = data.EVM.TokenHolders;
    const addresses = holders.map((item) => item.Holder.Address.toLowerCase());

    console.log(`✅ Fetched ${addresses.length} whale addresses.`);
    return addresses;
  } catch (error) {
    console.error("❌ Error fetching whale addresses:", error.message);
    return [];
  }
}

/**
 * Fetch real-time transactions for the given whale addresses on the BSC network.
 * @param {string[]} whaleAddresses - Array of whale addresses.
 * @param {number} limit - Number of transactions to fetch per request.
 * @returns {Promise<Object[]>} Array of transaction objects.
 */
async function fetchWhaleTransactions(whaleAddresses, limit = 100) {
  console.log("Fetching whale transactions...");

  if (whaleAddresses.length === 0) {
    console.error("❌ No whale addresses retrieved.");
    return [];
  }

  const query = `
    query getWhaleTransactions($network: evm_network!, $addresses: [String!]) {
      EVM(network: $network) {
        Transactions(
          where: {
            Transaction: {
              From: { in: $addresses },
              ValueInUSD: { gt: "100000" }
            }
          }
        ) {
          Transaction {
            Hash
            Value
            ValueInUSD
            To
            From
          }
          Block {
            Number
          }
        }
      }
    }
  `;

  const variables = {
    network: "bsc",
    addresses: whaleAddresses,
    // limit: limit,
  };

  try {
    const response = await axios.post(
      "https://streaming.bitquery.io/graphql", // API v2 Streaming Endpoint
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.BITQUERY_API_KEY,
        },
      }
    );

    const { data, errors } = response.data;

    if (errors && errors.length > 0) {
      console.error("❌ API errors:", errors);
      return [];
    }

    const transactionsData = data.EVM.Transactions;

    if (!transactionsData || transactionsData.length === 0) {
      console.log("ℹ️ No whale transactions found.");
      return [];
    }

    const transactions = transactionsData.map((tx) => ({
      hash: tx.Transaction.Hash,
      valueUSD: parseFloat(tx.Transaction.ValueInUSD),
      from: tx.Transaction.From.toLowerCase(),
      to: tx.Transaction.To.toLowerCase(),
      blockNumber: tx.Block.Number,
      network: "bsc",
    }));

    console.log(`✅ Fetched ${transactions.length} transactions.`);
    return transactions;
  } catch (error) {
    if (error.response) {
      console.error("❌ Error status:", error.response.status);
      console.error(
        "❌ Error data:",
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error("❌ Error fetching whale transactions:", error.message);
    }
    return [];
  }
}

module.exports = { getTopWhaleAddresses, fetchWhaleTransactions };
