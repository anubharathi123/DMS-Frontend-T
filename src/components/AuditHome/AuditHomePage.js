import React from "react";
import { Button, Grid, Typography, Box, Paper } from "@mui/material";
import { PlusCircle, Upload, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuditHomePage = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "User Creation", icon: <PlusCircle size={20} />, route: "/create-audit" },
    { label: "Assign Auditor to Manager", icon: <PlusCircle size={20} />, route: "/assign-auditor" },
    { label: "Assign Company to Auditor", icon: <PlusCircle size={20} />, route: "/assign-company" },
    { label: "Audit Status by Company", route: "/status-company" },
    { label: "Audit Load by Auditor", route: "/load-auditor" },
    { label: "Reconciliation Audit", icon: <Upload size={20} />, route: "/reconciliation" },
  ];

  return (
  <Box
    sx={{
      padding: 3,
      minHeight: "90vh",
      background: "linear-gradient(to bottom right, #ffffff)",
      marginLeft: "250px", // 👈 Shift the content to the right to avoid sidebar overlap
    }}
  >
   
    <Box sx={{ display: "flex", alignItems: "center", mb: 10 }}>
    </Box>

    {/* Title */}
    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 5 }}>
      Welcome to the Audit Portal!
    </Typography>

    {/* Cards Grid */}
    <Grid container spacing={3}>
      {buttons.map((btn, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "#001f5f",
              color: "#fff",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#003080",
              },
            }}
            onClick={() => navigate(btn.route)}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {btn.icon || <PlusCircle size={20} />}
            </Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: "monospace", fontSize: "1rem" }}
            >
              {btn.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

};

export default AuditHomePage;

