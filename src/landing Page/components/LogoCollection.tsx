import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

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
  'https://www.trustpeople.com/wp-content/uploads/2024/10/Image20241007152103.png',
  'https://ledgrinc.com/img/ledgr_black_vert.svg',
  'https://www.vdart.com/wp-content/uploads/2020/02/vdart.svg',
  "https://www.dimiour.io/wp-content/uploads/2024/03/Dimiour_Logo-2048x573.png",
  'data:image/png;base64,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',
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
  width: '100px',
  height: '30px',
  margin: '0 32px',
  filter: 'grayscale(100%)', // Initially black and white
  transition: 'filter 0.5s ease-in-out', // Smooth transition effect
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
        <Typography variant="body2" sx={{ fontWeight: 'bold',fontSize: '1.5rem', color: 'black' }}>
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
