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
import Logo1 from "../../assets/images/Logo.png";
import ProfileCard from "../../components/profile final/Profile";
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
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const profileButtonRef = React.useRef(null);
  const profileDropdownRef = React.useRef(null);

  const iconColor = "#ccc"; // Adjust as needed
  const profileImage = null; // Or your logic to get the image
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
  const handleNavigateHome = () => window.location.href = '/';
  const handleNavigate404 = () => window.location.href = '/settings';
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  React.useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");


    // Function to capitalize the first letter
    function capitalize(str: string): string {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const capitalizedName = storedName ? capitalize(storedName) : "";
    const capitalizedEmail = storedEmail ? capitalize(storedEmail) : "";

    if (capitalizedName) setName(capitalizedName);
    if (capitalizedEmail) setEmail(capitalizedEmail);
  }, []);


  const theme = useTheme();
  const logo = theme.palette.mode === "light" ? Logo1 : Logo1;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scroll = (id: string) => {
    console.log(`Trying to scroll to: ${id}`); // Debugging Log

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`Scrolling to: ${id}`);

        // Offset scrolling by 100px margin from the top
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        console.warn(`No element found with id: ${id}`);
      }
    }, 100); // Delay to ensure DOM is rendered before scrolling
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
      <Container maxWidth="xl" sx={{ mb: 2 }}>

      </Container>

      <Container maxWidth="xl">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
            <img src={logo} alt="Vdart Logo" style={{ height: "30px", marginRight: "30px" }} />
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
            <Button variant="text" color="info" onClick={() => scroll("hero")}>Home</Button>
            <Button variant="text" color="info" onClick={() => scroll("features")}>Features</Button>

            <Button variant="text" color="info" onClick={() => scroll("footer")}>Contact Us</Button>
            {localStorage.getItem("token") ? (
              <>
                <Box sx={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="profilebtn"
                    style={{ background: iconColor }}
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "profile" ? null : "profile")
                    }
                    ref={profileButtonRef}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-icon1" />
                    ) : (
                      <div className="profile-icon">{getInitials(name)}</div>
                    )}
                  </button>

                  {activeDropdown === "profile" && (
                    <div className="profile-dropdown" ref={profileDropdownRef}>
                      <p style={{color : "black"}}><b>{name}</b></p>
                      <p style={{color : "black"}}>{email}</p>
                      <hr />
                      <ul className="dropdown-menu">
                        <li>
                          <button type="button" className="dropdown-item" onClick={handleNavigateHome}>
                            Home
                          </button>
                        </li>
                        <li>
                          <button type="button" className="dropdown-item" onClick={handleNavigate404}>
                            Settings
                          </button>
                        </li>
                        <li>
                          <button type="button" className="signout-button" onClick={handleLogout}>
                            LogOut
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </Box>
              </>
            ) : (<Button
              variant="outlined"
              size="small"
              sx={{ color: "white", borderColor: "black", background: 'black' }}
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Button>)}

          </Box>

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
                <MenuItem onClick={() => { scroll("hero"); setOpen(false); }}>Home</MenuItem>
                <MenuItem onClick={() => { scroll("features"); setOpen(false); }}>Features</MenuItem>
                <MenuItem onClick={() => { scroll("footer"); setOpen(false); }}>Contact Us</MenuItem>
                <Divider sx={{ my: 2 }} />
                <MenuItem onClick={() => { window.location.href = '/login'; setOpen(false); }}>
                </MenuItem>
                <Button color="primary" variant="contained" fullWidth>
                  Sign In
                </Button>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
