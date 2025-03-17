import * as React from 'react';
import { useState, useEffect } from 'react';
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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
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
    personName: '',
    mobile: '',
    email: '',
    password: '',
    // contractAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // const role = localStorage.getItem('role');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    setFormData((prevData) => ({ ...prevData, contractAgreed: event.target.checked }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
    if (!formData.personName) tempErrors.personName = 'Person Name is required';
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.mobile)) tempErrors.mobile = 'Enter a valid mobile number';
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email';
    if (!formData.password) tempErrors.password = 'Password is required';
    // if (!formData.contractAgreed) tempErrors.contractAgreed = 'You must agree to the contract';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    try {
      const response = await authService.createuserOrganization(formData);
      alert('Company registered successfully!');
      
      // Clear stored form data after successful signup
      localStorage.removeItem('signupFormData');
  
      navigate('/login'); // Redirect to login page after registration
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again later.');
    }
  };

  const handleContractClick = () => {
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    navigate('/contractform');
  };

  return (
    <Card variant="outlined">
      <Typography component="h1" variant="h4" sx={{ textAlign: 'left' }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel>Username <span className="mandatory">*</span></FormLabel>
          <TextField
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Organization Name <span className="mandatory">*</span></FormLabel>
          <TextField
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Person Name <span className="mandatory">*</span></FormLabel>
          <TextField
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            error={!!errors.personName}
            helperText={errors.personName}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email <span className="mandatory">*</span></FormLabel>
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mobile <span className="mandatory">*</span></FormLabel>
          <PhoneInput
  // country={'us'}
  value={''} // Keeps the input field empty
  onChange={(value) => {
    setFormData((prevData) => ({ ...prevData, mobile: value }));
  }}
  inputStyle={{ width: '100%', paddingTop:'8px', paddingBottom:'8px',}}
  enableSearch
/>
  {errors.mobile && <Typography color="error">{errors.mobile}</Typography>}
          {/* <TextField
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
            error={!!errors.mobile}
            helperText={errors.mobile}
          /> */}
        </FormControl>
        <FormControl>
          <FormLabel>Password <span className="mandatory">*</span></FormLabel>
          <TextField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </FormControl>
        {/* <FormControl>
          <Box display="flex" alignItems="center">
            <Button type='button' onClick={handleContractClick}>
            <Typography>Read and Sign the Contract</Typography>
            </Button>
          </Box>
          {errors.contractAgreed && <Typography color="error">{errors.contractAgreed}</Typography>}
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
        <Button onClick={() => navigate('/login')}>
          Already have an account? Sign In
        </Button>
      </Box>
    </Card>
  );
}
