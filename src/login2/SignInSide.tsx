import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from './theme/AppTheme';
import SignInCard from './components/SignInCard';
import SignUpCard from './components/SignUpCard';
import Content from './components/Content';

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  const [isSignUp, setIsSignUp] = React.useState(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(0px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              '@media screen and (max-width: 900px)': {
                height: '170%',
              },
              ...theme.applyStyles('dark', {
                backgroundColor: 'hsl(220, 30%, 5%)',
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                '@media screen and (max-width: 1300px) and (min-width: 900px)': {
                  height: '155%',
                },
                '@media screen and (max-width: 1550px) and (min-width: 1300px)': {
                  height: '112%',
                },
                '@media screen and (max-width: 900px)': {
                  height: '170%',
                },
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
          }}
        >
          <Content />
          {isSignUp ? (
            <SignUpCard onSwitch={() => setIsSignUp(false)} />
          ) : (
            <SignInCard onSwitch={() => setIsSignUp(true)} />
          )}
        </Stack>
      </Stack>
    </AppTheme>
  );
}
