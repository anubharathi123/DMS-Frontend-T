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
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State for Change Password dialog
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

          {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}

          <OutlinedInput
            required
            placeholder={isOtpSent ? 'Enter OTP' : 'Email or Username'}
            type="text"
            fullWidth
            value={isOtpSent ? otp : username}
            onChange={(e) => (isOtpSent ? setOtp(e.target.value) : setUsername(e.target.value))}
          />
          {isOtpSent && isResendEnabled && (
            <Button onClick={sendOtp} variant="outlined">Resend OTP</Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">{isOtpSent ? 'Verify OTP' : 'Continue'}</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePassword open={isChangePasswordOpen} handleClose={() => setIsChangePasswordOpen(false)} />
    </>
  );
}