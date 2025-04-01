import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
 
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

  console.log(formData)
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




  // const handlePhoneChange = (value, data) => {
  //   setFormData((prevData) => ({ ...prevData, mobile: value || "" }));
  
  //   const countryCode = data?.countryCode ? data.countryCode.toUpperCase() : '';
  //   const phoneNumber = parsePhoneNumberFromString(value || "", countryCode);
  
  //   let error = '';
  
  //   if (!phoneNumber || !phoneNumber.isValid()) {
  //     error = 'Enter a valid phone number';
  //   } else {
  //     const fullNumberLength = phoneNumber.number.length; // Includes country code and national number
  
  //     // ✅ UAE Validation: Must be 9 digits including country code and start with 5
  //     if (countryCode === 'AE') {
  //       if (fullNumberLength !== 9 || !/^5\d{7}$/.test(phoneNumber.nationalNumber)) {
  //         error = 'UAE number must be 9 digits including country code and start with 5';
  //       }
  //     }
      
  //     // ✅ India Validation: Must be 10 digits including country code
  //     else if (countryCode === 'IN' && fullNumberLength !== 10) {
  //       error = 'Indian number must be exactly 10 digits including country code';
  //     }
  //   }
  
  //   setErrors((prevErrors) => ({ ...prevErrors, mobile: error }));
  // };
  
  



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

  // Phone number validation (UAE: +971 followed by 9 digits)
  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, mobile: value || "" }));

    // Parse the number properly to check if it's valid for UAE
    const phoneNumber = parsePhoneNumberFromString(value, 'AE');

    if (!phoneNumber || !phoneNumber.isValid() || phoneNumber.nationalNumber.length !== 9) {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: 'Enter a valid UAE phone number with 9 digits' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: '' }));
    }
  };

  
  
  const validateForm = () => {
    let tempErrors = {};
    const trimmedEmail = formData.email.trim();
    const blacklistedDomains = ['unknown.xyz', 'gmail.com', 'spam.com'];

    const isAllUpperCase = trimmedEmail === trimmedEmail.toUpperCase();
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
    if (!formData.personName) tempErrors.personName = 'Person Name is required';
  
    const phoneNumber = parsePhoneNumberFromString(formData.mobile, 'AE');
    if (!formData.mobile || !phoneNumber || !phoneNumber.isValid()) {
      tempErrors.mobile = 'Enter a valid UAE phone number';
    }
     const domain = trimmedEmail.split('@')[1]?.toLowerCase();
     const isSubdomain = domain?.split('.').length > 2;
    
    const emailRegex = /^(?![.-])([a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,20}$/;

    const password = formData.password;
    const isPasswordSameAsEmail = password === formData.email;
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length > 20) {
      tempErrors.password = 'Password too long';
    } else if (!passwordRegex.test(password)) {
      tempErrors.password = 'Password must include uppercase, lowercase, number & special char, no spaces';
    } else if (isPasswordSameAsEmail) {
      tempErrors.password = 'Password should not be same as email';
    } else if (/[^\x00-\x7F]/.test(password)) {
      tempErrors.password = 'Emoji or non-standard characters not allowed';
    }
    

    if (!trimmedEmail) {
      tempErrors.email = 'Email required';
    } else if (trimmedEmail.length > 255) {
      tempErrors.email = 'Email too long';
    } else if (isAllUpperCase) {
      tempErrors.email = 'Email cannot be fully uppercase';
    } else if (!emailRegex.test(trimmedEmail)) {
      tempErrors.email = 'Enter a valid email';
    } else if (blacklistedDomains.includes(domain)) {
      tempErrors.email = 'Unsupported domain';
    } else if (isSubdomain) {
      tempErrors.email = 'Subdomains are not supported';
    }
    
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
    






  // const validateForm = () => {
  //   let tempErrors = {};

  //   if (!formData.username) tempErrors.username = 'Username is required';
  //   if (!formData.companyName) tempErrors.companyName = 'Company Name is required';
  //   if (!formData.personName) tempErrors.personName = 'Person Name is required';
  //   const phoneNumber = parsePhoneNumberFromString(formData.mobile, 'AE'); // Explicitly specify UAE country code
  //   if (!formData.mobile || !phoneNumber || !phoneNumber.isValid()) {
  //     tempErrors.mobile = 'Enter a valid UAE phone number';
  //   }
  //   if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email';
  //   if (!formData.password) tempErrors.password = 'Password is required'; 

  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await authService.createuserOrganization(formData);
      console.log(formData)
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
    value={formData.username.replace(/^AE-/, '')} // Only keep the numeric part in field
    placeholder="98765432"
    onChange={(e) => {
      let input = e.target.value;

      // Remove non-digits
      input = input.replace(/\D/g, '');

      // Prepend AE-
      const finalValue = `AE-${input}`;
      handleChange({ target: { name: 'username', value: finalValue } });
    }}
    InputProps={{
      startAdornment: <InputAdornment position="start">AE-</InputAdornment>,
    }}
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
    onChange={(e) => {
      const trimmedValue = e.target.value.trim();
      handleChange({ target: { name: 'email', value: trimmedValue } });
    }}
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
