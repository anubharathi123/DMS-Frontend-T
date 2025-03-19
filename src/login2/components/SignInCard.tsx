import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import ChangePassword from '../components/ChangePassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';

// Additional imports
import { useNavigate } from 'react-router-dom';
import authService from '../../ApiServices/ApiServices'; // Adjust the path as necessary
import { IoEye, IoEyeOff } from 'react-icons/io5';

const Card = styled(MuiCard)<{ component?: React.ElementType }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...(theme.applyStyles && theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  })),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);  
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Additional state variables
  const [otp, setOtp] = React.useState('');
  const [messages, setMessages] = React.useState<string[]>([]);
  const [isOtpVisible, setIsOtpVisible] = React.useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = React.useState(false);
  const [isOtpVerified, setIsOtpVerified] = React.useState(false);
  const [counter, setCounter] = React.useState(30);
  const [isResendEnabled, setIsResendEnabled] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [first, setFirst] = useState(false);

  const navigate = useNavigate();

  // useEffect for OTP timer
  React.useEffect(() => {
    let timer: number;
    if (isOtpVisible && counter > 0) {
      timer = window.setTimeout(() => setCounter((prev) => prev - 1), 1000);
    } else if (counter === 0) {
      setIsResendEnabled(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [counter, isOtpVisible]);

  const handleClickOpen = () => {
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setMessages([]); 
    event.preventDefault(); // Prevent default form submission
    validateInputs();
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (isValid) {
      if (isOtpVisible) {
        handleOtpSubmit();
      } else {
        handleLoginSubmit(email.value, password.value);
      }
    }

    return isValid;
  };


  // Additional functions
  const handleLoginSubmit = async (username: string, password: string) => {
    try {
      const loginResponse = await authService.login({ username, password });
      console.log('Login successful:', loginResponse);
      localStorage.setItem('msi',loginResponse.msi);
      setFirst(loginResponse.first);

      setIsOtpVisible(true);
      setCounter(30);
      setIsResendEnabled(false);
      setMessages([]);

      const otpResponse = await authService.sendOTP();
      console.log('OTP sent successfully:', otpResponse);

    } catch (error: any) {
      console.error('Login error:', error.message || error);
      console.log('Login failed:', error.detail);
      setMessages([error.detail || 'Login failed']);
      setIsOtpVisible(false); // Reset OTP visibility on failure
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const username = (document.getElementById('email') as HTMLInputElement)?.value;
      
      if (!otp) {
        setMessages(['Please enter the OTP']);
        return;
      }

      const verifyResponse = await authService.verifyOTP({ email: username, otp });
      console.log('OTP verification successful:', verifyResponse);

      // Handle successful verification
      // const details_data = await authService.details();
      // console.log(details_data);
      console.log(first)
      if (first){
        console.log('change password')
        localStorage.setItem('first', 'true');
        setIsChangePasswordOpen(true);
        // handleClose();
        console.log('change password close')

      }
      else{
      setIsLoginSuccessful(true);
      localStorage.setItem('access_status', 'true');
      navigate('/profile');
      }

    } catch (error: any) {
      console.error('OTP verification error:', error.message || error);
      setMessages([error.message || 'Invalid OTP. Please try again.']);
      setIsOtpVerified(false);
      setOtp(''); // Clear OTP field on failure
    }
  };


  const handleResendOtp = async () => {
    try {
      setCounter(30);
      setIsResendEnabled(false);
      const resendResponse = await authService.resendOTP();
      console.log('OTP resent successfully:', resendResponse);

      setMessages(['OTP resent successfully.']);
    } catch (error: any) {
      console.error('Resend OTP error:', error.message || error);
      setMessages([error.message || 'Failed to resend OTP.']);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleNavigate = () => {
    navigate('/sign-up');  // Navigate to the sign-up page
  };  

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            disabled={isOtpVisible}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            required
            autoFocus
            fullWidth
            variant="outlined"
            disabled={isOtpVisible}
            color={passwordError ? 'error' : 'primary'}
            InputProps={{
              endAdornment: (
                <Button
                  type="button"
                  onClick={togglePasswordVisibility}
                  sx={{ minWidth: 'auto' }}
                  disabled={isOtpVisible}
                  style={{background: 'transparent'}}
                >
                  {isPasswordVisible ? <IoEyeOff /> : <IoEye />}
                </Button>
              ),
            }}
          />
        </FormControl>

        {/* OTP Input Field */}
        {isOtpVisible && (
          <FormControl>
            <FormLabel htmlFor="otp">OTP</FormLabel>
            <TextField
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Box sx={{ mt: 1 }}>
              {isResendEnabled ? (
                <Link
                  component="button"
                  onClick={handleResendOtp}
                  variant="body2"
                >
                  Resend OTP
                </Link>
              ) : (
                <Typography variant="body2">
                  Resend OTP in {counter} seconds
                </Typography>
              )}
            </Box>
          </FormControl>
        )}

        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        

        <Button
          type="submit"
          fullWidth
          variant="contained"
        
          // onClick={validateInputs}
        >
          {isOtpVisible ? 'Verify OTP' : 'Sign in'}
        </Button>

        {/* Display messages */}
        {messages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {messages.map((msg, index) => (
              <Typography key={index} color="error">
                {msg}
              </Typography>
            ))}
          </Box>
          
        )}

        <Typography sx={{ textAlign: 'center' }}>
        <Button onClick={handleNavigate} sx={{ mt: 2 }}>
          Don't have an account? Sign Up
        </Button>
        </Typography>
      </Box>
      {/* <Divider>or</Divider> */}
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with GitHub')}
          startIcon={<FacebookIcon />}
        >
          Sign in with GitHub
        </Button>
      </Box> */}
      <ForgotPassword open={open} handleClose={handleClose} />
      <ChangePassword open={isChangePasswordOpen} handleClose={() => setIsChangePasswordOpen(false)} />
    </Card>

  );
}