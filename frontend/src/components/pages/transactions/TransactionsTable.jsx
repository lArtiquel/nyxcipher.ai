import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

function TransactionsTable({ transactions }) {
  const columns = [
    {
      field: "hash",
      headerName: "Hash",
      flex: 2,
    },
    {
      field: "valueUSD",
      headerName: "Amount (USD)",
      flex: 1,
      type: "number",
    },
    {
      field: "from",
      headerName: "Sender",
      flex: 1,
    },
    {
      field: "to",
      headerName: "Receiver",
      flex: 1,
    },
    {
      field: "blockNumber",
      headerName: "Block Number",
      flex: 1,
      type: "number",
    },
  ];

  return (
    <Paper elevation={3} style={{ width: "100%", overflow: "hidden" }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        getRowId={(row) => row.hash}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        autoHeight
      />
    </Paper>
  );
}

export default TransactionsTable;
