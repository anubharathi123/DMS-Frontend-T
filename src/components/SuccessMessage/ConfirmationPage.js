import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width:"100%",
        textAlign: "center",
        bgcolor: "#f4f7fc",
      }}
    >
      {/* Tick Icon */}
      <CheckCircleIcon sx={{ fontSize: 80, color: "#08d110", mb: 2 }} />

      {/* Success Message */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "#22005b", fontFamily: "Poppins, sans-serif" }}
      >
        MSI Submitted Successfully!
      </Typography>

      {/* Additional Info */}
      <Typography
        sx={{ fontSize: 18, color: "#555", mt: 1.5, fontFamily: "Poppins, sans-serif" }}
      >
        After validation, you will receive an email.  
        <br /> Once approved, you can log in to the product.
      </Typography>

      {/* Go to Home/Login Button */}
      <Button
        variant="contained"
        sx={{
          mt: 3,
          bgcolor: "#22005b",
          "&:hover": { bgcolor: "#5321ca" },
          fontSize: 16,
          px: 4,
          py: 1,
        }}
        onClick={() => navigate("/login")} // Redirect to login after approval
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default ConfirmationPage;
