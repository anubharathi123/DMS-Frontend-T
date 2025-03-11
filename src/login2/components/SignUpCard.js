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
    width: '500px',
  },
}));

export default function SignUpCard({ onSwitch }) {
  const [formData, setFormData] = useState({
    username: '',
    companyName: '',
    firstName: '',
    // lastName: '',
    mobile: '',
    email: '',
    password: '',
    // password2: '',
    contractAgreed: false, // Default to unchecked
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
    // if (!formData.lastName) tempErrors.lastName = 'Last Name is required';
    if (!/^[0-9]{10}$/.test(formData.mobile)) tempErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email';
    if (!formData.password) tempErrors.password = 'Password is required';
    if (!formData.contractAgreed) tempErrors.contractAgreed = 'You must agree to the contract';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      await authService.createuserOrganization(formData); // Call the API service
      alert('Company registered successfully!');
      navigate('/OrganizationPending');
    } catch (error) {
    } finally {
    }
  };

  const handleNavigate = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <Card variant="outlined">
      <Typography component="h1" variant="h4" sx={{ textAlign: 'left' }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel>Username <span className='mandatory'>*</span></FormLabel>
          <TextField name="username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
        </FormControl>
        <FormControl>
          <FormLabel>Organization Name <span className='mandatory'>*</span></FormLabel>
          <TextField name="companyName" value={formData.companyName} onChange={handleChange} error={!!errors.companyName} helperText={errors.companyName} />
        </FormControl>
        <FormControl>
          <FormLabel>First Name <span className='mandatory'>*</span></FormLabel>
          <TextField name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
        </FormControl>
        {/* <FormControl>
          <FormLabel>Last Name <span className='mandatory'>*</span></FormLabel>
          <TextField name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
        </FormControl> */}
        <FormControl>
          <FormLabel>Mail ID <span className='mandatory'>*</span></FormLabel>
          <TextField name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
        </FormControl>
        <FormControl>
          <FormLabel>Mobile <span className='mandatory'>*</span></FormLabel>
          <TextField name="mobile" value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} />
        </FormControl>
        <FormControl>
          <FormLabel>New Password <span className='mandatory'>*</span></FormLabel>
          <TextField type="password" name="password1" value={formData.password1} onChange={handleChange} error={!!errors.password1} helperText={errors.password1} />
        </FormControl>
        {/* <FormControl>
          <FormLabel>Confirm Password <span className='mandatory'>*</span></FormLabel>
          <TextField type="password" name="password2" value={formData.password2} onChange={handleChange} error={!!errors.password2} helperText={errors.password2} />
        </FormControl> */}
        <FormControl> 
          <Box display="flex" alignItems="center">
            <Checkbox checked={formData.contractAgreed} onChange={handleCheckboxChange} />
            <Typography>I agree to the contract</Typography>
          </Box>
          {errors.contractAgreed && <Typography color="error">{errors.contractAgreed}</Typography>}
        </FormControl>
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
        <Button onClick={handleNavigate}>
          Already have an account? Sign In
        </Button>
      </Box>
    </Card>
  );
}
