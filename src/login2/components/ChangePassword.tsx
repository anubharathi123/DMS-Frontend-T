

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import authService from '../../ApiServices/ApiServices';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ChangePassword({ open, handleClose }: ChangePasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  

  const togglePasswordVisibility1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  };
  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    try {
      await authService.changePassword({ password });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => {
        handleClose();
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to change password. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>To change your password, please enter a new password and confirm it below.</DialogContentText>
        {/* <DialogContentText>
           {"Enter your account's email address, and we'll send you a link to reset your password."}
          </DialogContentText> */}
        <DialogContentText variant="body2" sx={{ mt: -1, color: 'text.secondary' }}>
    Your new password must be at least 8 characters long. Make sure to choose a strong password that's hard to guess.
  </DialogContentText>


        {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
        {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}

        <OutlinedInput
          required
          id="new-password"
          placeholder="New Password"
          type={isPasswordVisible1 ? 'text' : 'password'}

          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <Button
                  type="button"
                  onClick={togglePasswordVisibility1}
                  sx={{ minWidth: 'auto' }}
                  // disabled={isOtpVisible}
                  style={{background: 'transparent'}}
                >
                  {isPasswordVisible1 ? <IoEyeOff /> : <IoEye />}
                </Button>
          }
        />

        <OutlinedInput
          required
          id="confirm-password"
          placeholder="Confirm Password"
          type={isPasswordVisible2 ? 'text' : 'password'}

          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          endAdornment={
            <Button
                  type="button"
                  onClick={togglePasswordVisibility2}
                  sx={{ minWidth: 'auto' }}
                  // disabled={isOtpVisible}
                  style={{background: 'transparent'}}
                >
                  {isPasswordVisible2 ? <IoEyeOff /> : <IoEye />}
                </Button>
          }
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}



