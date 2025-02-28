import React, { createContext, useState, useContext } from "react";

// Create context
const ProfileImageContext = createContext();

// ProfileImageProvider to wrap the app and provide context
export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

// Custom hook to use the profile image context
export const useProfileImage = () => {
  return useContext(ProfileImageContext);
};
