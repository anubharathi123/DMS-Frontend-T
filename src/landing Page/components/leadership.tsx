import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTheme } from '@mui/system';

const leaders = [
  {
    image: "https://www.trustpeople.com/wp-content/uploads/2024/04/sidd-300x300-1.jpg",
    name: 'Sidd Ahmed',
    position: 'President / CEO',
    linkedin: 'https://www.linkedin.com/in/siddsa/',
  },
  {
    image: "https://www.trustpeople.com/wp-content/uploads/2024/04/rohit-1-300x300-1.jpg",
    name: 'Rohit Bardaiyar',
    position: 'Executive Vice President',
    linkedin: 'https://www.linkedin.com/in/rohit-bardaiyar-7051b8b/',
  },
  {
    image: "https://www.trustpeople.com/wp-content/uploads/2024/04/David-1-300x300-1.jpg",
    name: 'David Sexton',
    position: 'Associate Vice President (AVP) – Client Accounts',
    linkedin: 'https://www.linkedin.com/in/david-sexton-10687b6b/',
  },
];

export default function Leaders() {
  return (
    <Container
      id="leaders"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box textAlign="center" width={{ sm: '100%', md: '60%' }}>
        <Typography component="h2" variant="h4" gutterBottom>
          Our Leadership
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Meet the visionaries who drive our success. Learn about their leadership and how they contribute to innovation and excellence.
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {leaders.map((leader, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: 350,
                boxShadow: 3,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Leader Image */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 260,
                  // overflow: 'hidden',
                }}
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex:10,
                  }}
                />
                {/* LinkedIn Icon Positioned Half on Image & Content */}
                <IconButton
                  component="a"
                  href={leader.linkedin}
                  target="_blank"
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: 20,
                    backgroundColor: '#0077b5',
                    color: 'white',
                    boxShadow: 2,
                    zIndex:10,
                    '&:hover': { backgroundColor: '#005582' },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>

              {/* Leader Info */}
              <CardHeader
                title={leader.name}
                subheader={leader.position}
                sx={{
                  textAlign: 'center',
                  pt: 4,
                  '& .MuiCardHeader-title': { fontWeight: 'bold', fontSize: 18 },
                  '& .MuiCardHeader-subheader': { color: 'text.secondary' },
                }}
              />

              {/* <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {leader.position}
                </Typography>
              </CardContent> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}