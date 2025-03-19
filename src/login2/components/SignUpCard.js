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
import { styled } from '@mui/material/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import authService from '../../ApiServices/ApiServices';
import { isValidPhoneNumber, parsePhoneNumberFromString,getExampleNumber } from "libphonenumber-js";
import './SignUpCard.css'

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
  });

  const [errors, setErrors] = useState({});
  // const [PhoneNumber, SetPhoneNumber] = useState({})
  // const [valid, setValid] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem('signupFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (event) => {
    const {name, value}= event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // SetPhoneNumber(input);
    // setValid(validatePhoneNumber(input));
  };

  // const handlePhoneChange = (value) => {
  //   if (isValidPhoneNumber(value)) {
  //     setFormData((prevData) => ({ ...prevData, mobile: value }));
  //   } else {
  //     console.error("Invalid phone number!");
  //   }
  // };

  // // Phone number validation (UAE: +971 followed by 9 digits)
  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, mobile: value || "" }));
  
    // Parse the number properly to check if it's valid for UAE
    const phoneNumber = parsePhoneNumberFromString(value, 'AE');
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: 'Enter a valid UAE phone number' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: '' }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
    if (!formData.personName) tempErrors.personName = 'Person Name is required';
    const phoneNumber = parsePhoneNumberFromString(formData.mobile, 'AE'); // Explicitly specify UAE country code
    if (!formData.mobile || !phoneNumber || !phoneNumber.isValid()) {
      tempErrors.mobile = 'Enter a valid UAE phone number';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email';
    if (!formData.password) tempErrors.password = 'Password is required'; 

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await authService.createuserOrganization(formData);
      alert('Company registered successfully!');
      localStorage.removeItem('signupFormData');
      navigate('/login'); 
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again later.');
    }
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
            country={'ae'}
            value={formData.mobile}
            placeholder={getExampleNumber}
            onChange={handlePhoneChange}
            inputStyle={{ width: '432px', paddingTop:'8px', paddingBottom:'8px' }}
            inputProps={{
              required:true
            }}
            enableSearch
          />
          {errors.mobile && <Typography color="error">{errors.mobile}</Typography>}
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
