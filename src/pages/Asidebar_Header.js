import React from 'react';
import Header from '../components/header/header';
import AsideBar from '../components/Asidebar/AsideBar';


const CompanyCreation = () => {
  
  return (
    <div className='Asidebar-header-mobile' style={{width: '100%',position: 'fixed',top: '0'}} ><Header/>
    <AsideBar/>
      </div>
    
    
  );
};

export default CompanyCreation;
