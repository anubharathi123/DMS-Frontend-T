// src/ProfileImage.js
import React, { useContext } from 'react';
import { ProfileImageContext } from './context/ProfileImageContext';

const ProfileImage = () => {
  const { profileImage, setProfileImage } = useContext(ProfileImageContext);

  return (
    <div>
      <img src={profileImage} alt="Profile" />
      <button onClick={() => setProfileImage('new_image_url')}>Change Image</button>
    </div>
  );
};

export default ProfileImage;
