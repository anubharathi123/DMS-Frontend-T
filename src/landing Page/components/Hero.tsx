import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';
import Logo from "../../assets/images/Logo.png";
import LogoBG from "../../assets/images/HomeBG.png";

// import background from '../../assets/images/background.png';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  // borderColor: theme.palette.grey[200],
  // boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  // backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
  // backgroundSize: 'cover',
  // [theme.breakpoints.up('sm')]: {
  //   marginTop: theme.spacing(10),
  //   height: 700,
  // },
  // ...theme.applyStyles('dark', {
  //   boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
  //   backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || 'https://mui.com'}/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
  //   outlineColor: 'hsla(220, 20%, 42%, 0.1)',
  //   borderColor: theme.palette.grey[700],
  // }
// ),
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        // backgroundImage:{LogoBG},
        backgroundRepeat: 'no-repeat',

        // backgroundImage:
        //   'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        // ...theme.applyStyles('dark', {
        //   backgroundImage:
        //     'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        backgroundImage: `url(${LogoBG})`,
        opacity:"0.8",
        backgroundSize: 'cover',
        ...theme.applyStyles('dark', {
        }),
      })}
    >
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
            <img src={Logo} alt="Vdart Logo" style={{ height: "130px", marginLeft: "20px"}} />
          </Box>
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' }, marginTop:"0px" }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(2rem, 10vw, 2.5rem)',
            }}
          >
            Smart&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'hsl(0deg 100% 52.35%);',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Secure&nbsp;
            </Typography>
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Swift
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            "Port Docs Streamlining document management, enhancing collaboration, and ensuring compliance all in one digital solution."
          </Typography>
          <Stack
            // direction={{ xs: 'column', sm: 'row' }}
            // spacing={1}
            // useFlexGap
            // sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            {/* <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
              Email
            </InputLabel> */}
            {/* <TextField
              id="email-hero"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="Enter your email address"
              placeholder="Your email address"
              fullWidth
              slotProps={{
                htmlInput: {
                  autoComplete: 'off',
                  'aria-label': 'Enter your email address',
                },
              }}
            /> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => window.location.href = '/login'}
              sx={{ minWidth: 'fit-content' }}
            >
              Start now
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
        {/* <StyledBox id="image" /> */}
      </Container>
    </Box>
  );
}
