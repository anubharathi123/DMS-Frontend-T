import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import apiservices from '../../ApiServices/ApiServices';
import Logo from '../../assets/images/Logo.png';
import './footer.css';

// Define types
interface FormData {
  name: string;
  email: string;
  mobile: string;
  country: string;
  company_name: string;
  designation: string;
  team_size: string;
  contact_country: string;
  contact_time: string;
  comments: string;
}


interface Errors {
  [key: string]: string;
}

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://Vdart.com/">
        PortDocs
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
  email: '',
  mobile: '',
  country: 'UAE',
  company_name: '',
  designation: '',
  team_size: '',
  contact_country: '',
  contact_time: '',
  comments: '',
  });

  const [errors, setErrors] = React.useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, mobile: value });
  };

  const handleSubmit = async () => {
    let newErrors: Errors = {};
    const requiredFields: (keyof FormData)[] = [
      'name',
      'email',
      'mobile',
      'country',
      'company_name',
      'designation',
      'team_size',
    ];
  
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await apiservices.enquire(formData);  
      alert('Enquiry submitted successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        country: 'UAE',
        company_name: '',
        designation: '',
        team_size: '',
        contact_country: '',
        contact_time: '',
        comments: '',
      });
      console.log("Enquiry Data:",response)
      setErrors({});
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Try again!');
    }
  };
  

  return (
    <Container
    id="footer"
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
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: { xs: '100%', sm: '60%' } }}>
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <img src={Logo} alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Subscribe for weekly updates. No spams ever!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            width: '100%',
            gap: 1,
            padding: '16px',
            borderRadius: '12px',
            background: 'white',
            boxShadow: 'var(--Paper-shadow)',
            border: '1px solid',
            borderColor: 'hsla(220, 20%, 80%, 0.4)',
          }}
        >
          <Stack spacing={1} sx={{ textAlign: 'left' }}>
            <FormLabel>Name</FormLabel>
            <TextField
              name="name"
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLTextAreaElement>)}
              error={!!errors.name}
              helperText={errors.name}
            />

            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              name="email"
              fullWidth
              size="small"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <FormLabel>Mobile</FormLabel>
            <PhoneInput
              country="ae"
              value={formData.mobile}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%', height: '40px' }}
              enableSearch
            />
            {errors.mobile && <Typography color="error">{errors.mobile}</Typography>}

            {/* <FormLabel>Country</FormLabel>
            <TextField
              name="country"
              fullWidth
              size="small"
              value={formData.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
            /> */}

            <FormLabel>Company Name</FormLabel>
            <TextField
              name="company_name"
              fullWidth
              size="small"
              value={formData.company_name}
              onChange={handleChange}
              error={!!errors.company_name}
              helperText={errors.company_name}
            />

            <FormLabel>Designation</FormLabel>
            <TextField
              name="designation"
              fullWidth
              size="small"
              value={formData.designation}
              onChange={handleChange}
              error={!!errors.designation}
              helperText={errors.designation}
            />

            <FormLabel>Team Size</FormLabel>
            <TextField
              name="team_size"
              fullWidth
              size="small"
              value={formData.team_size}
              onChange={handleChange}
              error={!!errors.team_size}
              helperText={errors.team_size}
            />
<FormControl fullWidth sx={{ mb: 2 }}>
  <FormLabel>
    Contact Timing <span className="mandatory">*</span>
  </FormLabel>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
    <TextField
      select
      label=""
      name="contact_country"
      value={formData.contact_country || ''}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      size="small"
      SelectProps={{
        native: true,
      }}
    >
      <option value="">Select Country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="gb">United Kingdom</option>
      <option value="au">Australia</option>
      <option value="in">India</option>
      {/* Add more countries as needed */}
    </TextField>

    <TextField
      label="Preferred Time"
      type="time"
      name="contact_time"
      value={formData.contact_time || ''}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
    />
  </Box>
</FormControl>

<FormLabel sx={{ mt: 2 }}>Comments</FormLabel>
<textarea
  name="comments"
  value={formData.comments || ''}
  onChange={handleChange}
  rows={4}
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid lightgray',
    fontSize: '14px',
    marginTop: '8px',
    fontFamily: 'inherit',
  }}
  placeholder="Enter your comments here..."
></textarea>



            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
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
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>&nbsp;•&nbsp;</Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack direction="row" spacing={1} useFlexGap sx={{ color: 'text.secondary' }}>
          <IconButton href="https://github.com/mui" aria-label="GitHub" sx={{ alignSelf: 'center' }}>
            <GitHubIcon />
          </IconButton>
          <IconButton href="https://x.com/MaterialUI" aria-label="X" sx={{ alignSelf: 'center' }}>
            <XIcon />
          </IconButton>
          <IconButton href="https://www.linkedin.com/company/mui/" aria-label="LinkedIn" sx={{ alignSelf: 'center' }}>
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
