import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

function IntervalSetter({ interval, setInterval }) {
  const [value, setValue] = useState(interval);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInterval = Number(value);
    if (newInterval >= 1) {
      setInterval(newInterval);
    } else {
      alert("Please enter a valid interval (minimum 1 second).");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TextField
        label="Refresh Interval (seconds)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{
          min: 1,
        }}
      />
      <Button
        variant="contained"
        type="submit"
        sx={{
          backgroundColor: "#90caf9",
          color: "black",
          "&:hover": {
            backgroundColor: "#64b5f6",
          },
        }}
      >
        Set Interval
      </Button>
    </Box>
  );
}

export default IntervalSetter;
