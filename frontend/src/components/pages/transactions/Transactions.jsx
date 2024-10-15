import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./TransactionsTable";
import IntervalSetter from "./IntervalSetter";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [interval, setIntervalValue] = useState(60); // Default 60 seconds
  const [countdown, setCountdown] = useState(interval);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchTransactions();

    const intervalId = setInterval(fetchTransactions, interval * 1000);
    return () => clearInterval(intervalId);
  }, [interval]);

  useEffect(() => {
    setCountdown(interval);
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : interval));
    }, 1000);
    return () => clearInterval(timer);
  }, [interval]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`
      );

      const mappedData = response.data.map((tx) => ({
        hash: tx.hash || "N/A",
        valueUSD:
          tx.valueUSD !== undefined && tx.valueUSD !== null
            ? tx.valueUSD
            : "N/A",
        from: tx.from || "N/A",
        to: tx.to || "N/A",
        blockNumber: tx.blockNumber || "N/A",
      }));

      setTransactions(mappedData);
      console.log("Fetched transactions:", mappedData);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Binance Whale Transactions
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          marginBottom: 2,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "background.paper",
        }}
      >
        <IntervalSetter interval={interval} setInterval={setIntervalValue} />
      </Paper>
      <Typography variant="subtitle1" gutterBottom>
        Transactions will refresh in {countdown} seconds.
      </Typography>
      {loading ? (
        <CircularProgress sx={{ color: "primary.main", marginTop: 2 }} />
      ) : error ? (
        <Alert
          severity="error"
          sx={{ width: "100%", maxWidth: 600, marginTop: 2 }}
        >
          {error}
        </Alert>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            overflowX: "auto",
          }}
        >
          <TransactionsTable transactions={transactions} />
        </Box>
      )}
    </Box>
  );
}

export default Transactions;
