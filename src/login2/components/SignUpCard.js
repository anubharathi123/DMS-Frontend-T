import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
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
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function SignUpCard() {
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, contractAgreed: !formData.contractAgreed });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
    if (!formData.firstName) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last Name is required';
    if (!formData.mobile.match(/^\d{10}$/)) tempErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.email.match(/\S+@\S+\.\S+/)) tempErrors.email = 'Enter a valid email';
    if (!formData.address) tempErrors.address = 'Address is required';
    if (!formData.contractAgreed) tempErrors.contractAgreed = 'You must agree to the contract';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

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
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel>Username *</FormLabel>
          <TextField name="username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
        </FormControl>
        <FormControl>
          <FormLabel>Company Name *</FormLabel>
          <TextField name="companyName" value={formData.companyName} onChange={handleChange} error={!!errors.companyName} helperText={errors.companyName} />
        </FormControl>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <TextField name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <TextField name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
        </FormControl>
        <FormControl>
          <FormLabel>Mobile *</FormLabel>
          <TextField name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} />
        </FormControl>
        <FormControl>
          <FormLabel>Mail ID *</FormLabel>
          <TextField name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <TextField name="address" value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} />
        </FormControl>
        <FormControl>
          <FormLabel>Contract Agreement *</FormLabel>
          <Link href="/contractform" target="_blank" sx={{ textDecoration: 'underline' }}>
            Read and Sign the Contract
          </Link>
          <Checkbox checked={formData.contractAgreed} onChange={handleCheckboxChange} /> I agree to the contract
          {errors.contractAgreed && <Typography color="error">{errors.contractAgreed}</Typography>}
        </FormControl>
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Card>
  );
}