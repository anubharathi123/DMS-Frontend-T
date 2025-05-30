import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import authService from '../../ApiServices/ApiServices';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); 
  const [counter, setCounter] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Reset state variables when the dialog is opened
      setUsername('');
      setOtp('');
      setIsOtpSent(false);
      setToken(null);
      setErrorMessage('');
      setSuccessMessage('');
      setCounter(30);
      setIsResendEnabled(false);
    }
  }, [open]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOtpSent && counter > 0) {
      timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
    } else if (counter === 0) {
      setIsResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [isOtpSent, counter]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    setErrorMessage('');
    setSuccessMessage('');
    if (!isOtpSent) {
      if (!username) {
        setErrorMessage('Please enter your email or username.');
        return;
      }
      await handleResetPassword();
    } else {
      console.log('verify otp');
      await verifyOtp();
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await authService.resetPassword({ username });
      setToken(response.token);
      setIsOtpSent(true);
      await sendOtp();
      setSuccessMessage('OTP has been sent to your email.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to initiate password reset. Please try again.');
    }
  };

  const sendOtp = async () => {
    try {
      
      await authService.sendOTP();
      setSuccessMessage('OTP has been sent to your email.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp) {
        setErrorMessage('Please enter the OTP.');
        return;
      }
      await authService.verifyOTP({ token, otp });
      setSuccessMessage('OTP verified successfully!');
      setIsChangePasswordOpen(true); // Open Change Password popup
      navigate('/login');
      handleClose();
    } catch (error: any) {
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { backgroundImage: 'none' },
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <DialogContentText>
            {isOtpSent
              ? 'Enter the OTP sent to your email to verify your identity.'
              : "Enter your account's email address, and we'll send you a link to reset your password."}
              </DialogContentText>
                <OutlinedInput
                required
                placeholder={isOtpSent ? 'Enter OTP' : 'Email or Username'}
                type="text"
                fullWidth
                value={isOtpSent ? otp : username}
                onChange={(e) => {
                const value = e.target.value.trim();
                setErrorMessage(''); // Clear error message on input change
                if (!isOtpSent) {
                  setUsername(value);
                  // Enhanced validation logic
                  if (!value) {
                  setErrorMessage('Username or Email is required.');
                  } else if (!/^\d+$/.test(value) && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                  if (/^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                    setErrorMessage('Invalid Email format');
                  } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*\.[a-zA-Z]*$/.test(value)) {
                    setErrorMessage('Invalid Email format');
                  } else {
                    setErrorMessage('Enter a valid email or numeric username.');
                  }
                  }
                } else {
                  setOtp(value.replace(/\s/g, ''));
                }
                }}
                />
              {errorMessage && (
                <DialogContentText sx={{ color: 'red', mt: 1 }}>
                  {errorMessage}
                </DialogContentText>
              )}
          {isOtpSent && isResendEnabled && (
            <Button onClick={sendOtp} variant="outlined">Resend OTP</Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
            <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
              if (!isOtpSent) {
              const trimmedUsername = username.trim();
              if (!trimmedUsername) {
                e.preventDefault();
                setErrorMessage('Username or Email is required.');
              } else if (/[^a-zA-Z0-9@.]/.test(trimmedUsername)) {
                e.preventDefault();
                setErrorMessage('Special characters other than @ and . are not allowed.');
              } else if (
                !/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(trimmedUsername.toLowerCase()) &&
                !/^\d+$/.test(trimmedUsername)
              ) {
                e.preventDefault();
                setErrorMessage('Enter a valid email or numeric username.');
              }
              }
            }}
            >
            {isOtpSent ? 'Verify OTP' : 'Continue'}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePassword open={isChangePasswordOpen} handleClose={() => setIsChangePasswordOpen(false)} />
    </>
  );
}