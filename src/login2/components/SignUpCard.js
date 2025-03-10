import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import authService from '../../ApiServices/ApiServices';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  marginTop: '10%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
  [theme.breakpoints.up('sm')]: {
    width: '500px',
  },
}));

export default function SignUpCard({ onSwitch }) {
  const [formData, setFormData] = useState({
    username: '',
    companyName: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    contractAgreed: false,
  });
  const [contractSigned, setContractSigned] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, contractAgreed: !formData.contractAgreed });
  };

  const handleContractSign = () => {
    setContractSigned(true);
    setFormData({ ...formData, contractAgreed: true }); // Automatically check the box
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
    if (!formData.firstName) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last Name is required';
    if (!formData.created_date.match(/^\d{10}$/)) tempErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.email.match(/\S+@\S+\.\S+/)) tempErrors.email = 'Enter a valid email';
   
    if (!formData.contractAgreed) tempErrors.contractAgreed = 'You must agree to the contract';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePendingOrganization = () => {
    navigate('/OrganizationPending');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await authService.signup(formData);
        console.log('Signup successful:', response);
        navigate('/sign-in');
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };

  return (
    <Card variant="outlined">
      <Typography component="h1" variant="h4" sx={{ textAlign: 'left' }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel>Username *</FormLabel>
          <TextField name="username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
        </FormControl>
        <FormControl>
          <FormLabel>Organization Name *</FormLabel>
          <TextField name="companyName" value={formData.companyName} onChange={handleChange} error={!!errors.companyName} helperText={errors.companyName} />
        </FormControl>
        <FormControl>
          <FormLabel>Creation Date *</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker/>
          </LocalizationProvider>
        </FormControl>
        <FormControl>
          <FormLabel>Mail ID *</FormLabel>
          <TextField name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
        </FormControl>
       
        <FormControl>
          <FormLabel>Contract Agreement *</FormLabel>
          <Link href="/contractform" target="_blank" sx={{ textDecoration: 'underline' }} onClick={handleContractSign}>
            Read and Sign the Contract
          </Link>
          <Box display="flex" alignItems="center">
            <Checkbox checked={formData.contractAgreed} onChange={handleCheckboxChange} />
            <Typography>I agree to the contract</Typography>
          </Box>
          {contractSigned && (
            <Typography color="success.main" sx={{ fontSize: 14 }}>
              Contract Document has been signed
            </Typography>
          )}
          {errors.contractAgreed && <Typography color="error">{errors.contractAgreed}</Typography>}
        </FormControl>
        <Button type="submit" variant="contained" onClick={handlePendingOrganization} fullWidth>
          Sign Up
        </Button>
        <Button onClick={onSwitch}>
          Already have an account? Sign In
        </Button>
      </Box>
    </Card>
  );
}
