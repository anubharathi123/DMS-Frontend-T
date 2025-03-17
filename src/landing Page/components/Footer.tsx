import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import Logo from '../../assets/images/Logo.png';
import PhoneInput from 'react-phone-input-2';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// import SitemarkIcon from './SitemarkIcon';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://Vdart.com/">
        PortDocs
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignSelf:"center",
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
            alignSelf:"center",
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <img src={Logo} alt="Vdart Logo" style={{ height: '40px', marginRight:"20px" }} />
            {/* <SitemarkIcon /> */}
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Subscribe for weekly updates. No spams ever!
            </Typography>
            {/* <InputLabel htmlFor="email-newsletter">Email</InputLabel> */}
            
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            width:"100%",
            gap: 1,
            padding:'16px',
            borderRadius:'12px',
            background:"White",
            
            boxShadow:"var(--Paper-shadow);",
            border:"1px solid",
            borderColor:"hsla(220, 20%, 80%, 0.4)",
          
          }}
        >
          {/* <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Product
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Features
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Testimonials
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Highlights
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Pricing
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            FAQs
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Company
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            About us
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Careers
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Press
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Legal
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Contact
          </Link>*/}
       
        <Stack spacing={2} sx={{ width: '100%' }} >
          <TextField label="Name" fullWidth variant="outlined" size="small" />
          <TextField type="email" label="Email" fullWidth variant="outlined" size="small" />
          {/* <TextField label="Mobile" fullWidth variant="outlined" size="small" /> */}
          <PhoneInput
                // country={'us'}
                value={''} // Keeps the input field empty
                inputStyle={{ width: '100%',height:"40px", paddingTop:'8px', paddingBottom:'8px',}}
                enableSearch
              />
          <TextField label="Country" fullWidth variant="outlined" size="small" />
          <TextField label="Company Name" fullWidth variant="outlined" size="small" />
          <TextField label="Designation" fullWidth variant="outlined" size="small" />
          <TextField label="Team Size" fullWidth variant="outlined" size="small" />
            <FormControl>
              <FormLabel>Contact Timing <span className="mandatory">*</span></FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  select
                  label="Country"
                  fullWidth
                  variant="outlined"
                  size="small"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="gb">United Kingdom</option>
                  <option value="au">Australia</option>
                  <option value="in">India</option>
                  {/* Add more countries as needed */}
                </TextField>
                <TextField
                  type="time"
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              
            </FormControl>
          <textarea name="comment" form="usrform" style={{borderRadius: '5px', borderColor: 'lightgray'}}>Enter text here...</textarea>
          <Button variant="contained" color="primary" size="large">
            Submit
          </Button>
        </Stack>
            </Box> 
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
