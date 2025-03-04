import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ColorModeIconDropdown from "../theme/ColorModeIconDropdown";
import DartLogo from "../../assets/images/VDart-dark-logo.png";
import WhiteLogo from "../../assets/images/company_logo.png";

// Custom Styled Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const logo = theme.palette.mode === "light" ? DartLogo : WhiteLogo;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
      }}
    >
      {/* Top Bar for Contact Info */}
      <Container maxWidth="xl" sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", 
            alignItems: "center",
            bgcolor: "#007aff", 
            color: "white",
            py: 0.5,
            px: 2,
            fontSize: "0.875rem",
          }}
        >
          {/* Left Side - Contact Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">987654343</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: "darkblue", height: 16 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" />
              <Typography variant="body2">Inten@vdartinc.com</Typography>
            </Box>
          </Box>

          {/* Right Side - Sign In / Sign Up Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
  variant="outlined" 
  size="small" 
  sx={{ color: "white", borderColor: "white" }} 
  onClick={() => window.location.href = '/login'}
>
  Sign in
</Button>
<Button color="primary" variant="contained" size="small">
  Sign up
</Button>

          </Box>
        </Box>
      </Container>

      {/* Main Navbar */}
      <Container maxWidth="xl">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
            <img src={logo} alt="Vdart Logo" style={{ height: "40px", marginRight: "20px" }} />
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
            <Button variant="text" color="info">Home</Button>
            <Button variant="text" color="info">Services</Button>
            <Button variant="text" color="info">About Us</Button>
            <Button variant="text" color="info">Careers</Button>
            <Button variant="text" color="info">Contact Us</Button>
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{ sx: { top: 0 } }}
            >
              <Box sx={{ p: 5, backgroundColor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Home</MenuItem>
                <MenuItem>Services</MenuItem>
                <MenuItem>About Us</MenuItem>
                <MenuItem>Careers</MenuItem>
                <MenuItem>Contact Us</MenuItem>
                <Divider sx={{ my: 2 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign Up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign In
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
