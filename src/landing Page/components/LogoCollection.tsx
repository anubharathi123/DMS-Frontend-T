import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { margin, useTheme } from '@mui/system';
import vouch from '../../assets/images/Vouch.png'
import Dimiour from '../../assets/images/Dimiour.png'
import VDart from '../../assets/images/Vdart1.png'
import VValidate from '../../assets/images/V Validate.png'
import Ledgr from '../../assets/images/Ledgr.png'
import TrustPeople from '../../assets/images/TrustPeople.png'


const whiteLogos = [
  'https://www.trustpeople.com/wp-content/uploads/2024/10/Image20241007152103.png',
  'https://ledgrinc.com/img/ledgr_black_vert.svg',
  'https://www.vdart.com/wp-content/uploads/2020/02/vdart.svg',
  "https://www.dimiour.io/wp-content/uploads/2024/03/Dimiour_Logo-2048x573.png",
  // 'https://www.trustpeople.com/wp-content/uploads/2024/10/Image20241007152103.png',
  // 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.ambitionbox.com%2Freviews%2Fvdart-reviews&psig=AOvVaw3PSn9oH6IAiy6HtRUWBr7M&ust=1741328536282000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjz5Lno9IsDFQAAAAAdAAAAABAK',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
];

const darkLogos = [
  // VDart,
  
  
  // Ledgr,
  'https://www.vdart.com/wp-content/uploads/2020/02/vdart.svg',
  Dimiour,
  // "https://www.dimiour.io/wp-content/uploads/2024/03/Dimiour_Logo-2048x573.png",
  "https://www.trustpeople.com/wp-content/uploads/2024/10/Image20241007152103.png",
  // TrustPeople,
  // 'https://trustpeople.io/assets/images/trust-people-logo-png.png',
  // 'https://ledgrinc.com/img/ledgr_black_vert.svg',
  'https://ledgrinc.com/img/ledgr_black_vert.svg',
  // 'https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/57769620-6bf6-494c-a529-48ec26e003d7.png',
  vouch
  // 'https://media.licdn.com/dms/image/v2/D560BAQE50lD3RY_IiA/company-logo_200_200/company-logo_200_200/0/1688577144631/dimiour_logo?e=2147483647&v=beta&t=o2Ea-zyuRXKjdBhfNGO0hMGe9lKhhan1jTBMX17suNw',
//  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.globenewswire.com%2Fnews-release%2F2017%2F05%2F01%2F975236%2F32766%2Fen%2FTony-Maley-Joins-As-Chief-Technology-Officer-of-VDart-Digital.html&psig=AOvVaw3PSn9oH6IAiy6HtRUWBr7M&ust=1741328536282000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjz5Lno9IsDFQAAAAAdAAAAABAE',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
// 
];
// const logoStyle = {
//   width: '100px',
//   height: '30px',
//   margin: '0 32px',
//   // opacity: 1,
//   opacity: 1,
//   transition: 'opacity 0.5s ease, transform 0.5s ease',
//   '&:hover': {
//     opacity: 0.7,
//     transform: 'scale(1.1)',
//   },
// };

const logoStyle = {
  marginTop:'30px',
  // width: '160px',
  height: '30px',
  margin: '30px 32px',
  filter: 'grayscale(100%)', // Initially black and white
  transition: 'filter 0.3s ease-in-out', // Smooth transition effect
};

const hoverStyle = {
  filter: 'grayscale(0%)', // Full color on hover
  opacity:2,
};


export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold',fontSize: '1.5rem', color: 'gray' }}>
        TRUSTED PARTNERS
          </Typography>
        
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.9 }}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            {/* <Box component="img" src={logo} sx={{ ...logoStyle }} /> */}
            <Grid item xs={6} sm={3} key={index}>
  <img 
    src={logo} 
    alt={`logo-${index}`} 
    style={logoStyle} 
    onMouseEnter={(e) => e.currentTarget.style.filter = hoverStyle.filter}
    onMouseLeave={(e) => e.currentTarget.style.filter = logoStyle.filter}
  />
</Grid>
            {/* <img
              src={logo}
              alt={`Fake company number ${index + 1}`}
              style={logoStyle}
              className="w-24 h-auto filter grayscale hover:filter-none transition-all duration-300"
            /> */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
