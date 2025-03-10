import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Logo from "../../assets/images/Logo.png";
import LogoBG from "../../assets/images/HomeBG.png";

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${LogoBG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.2,
    zIndex: -1,
  },
}));

export default function Hero() {
  return (
    <HeroSection id="hero">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
          <img src={Logo} alt="Vdart Logo" style={{ height: "120px", marginLeft: "30px",opacity:"0.6" }} />
        </Box>
        <Stack spacing={3} useFlexGap sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, marginTop: "0px" }}>
          <Typography variant="h1" sx={{ display: 'flex',marginTop:"12px", flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', fontSize: 'clamp(2rem, 10vw, 2.5rem)' }}>
            Smart&nbsp;
            <Typography component="span" variant="h1" sx={{ fontSize: 'inherit', color: 'hsl(0deg 100% 52.35%)' }}>
              Secure&nbsp;
            </Typography>
            <Typography component="span" variant="h1" sx={{ fontSize: 'inherit', color: 'primary.main' }}>
              Swift
            </Typography>
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', width: { sm: '100%', md: '80%' } }}>
            "Port Docs Streamlining document management, enhancing collaboration, and ensuring compliance all in one digital solution."
          </Typography>
          <Stack>
            <Button variant="contained" color="primary" size="small" onClick={() => window.location.href = '/login'} sx={{ minWidth: 'fit-content' }}>
              Start now
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link href="#" color="primary" sx={{ fontWeight: 600 }}>
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
      </Container>
    </HeroSection>
  );
}
