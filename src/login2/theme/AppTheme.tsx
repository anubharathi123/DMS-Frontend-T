import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes: {
            light: {
              palette: {
                primary: {
                  lighter: '#e3f2fd',
                  light: '#64b5f6',
                  main: '#2196f3',
                  dark: '#1976d2',
                  contrastText: '#fff',
                  lighterChannel: 'e3f2fd',
                  darkerChannel: '1976d2',
                  darker: '#0d47a1',
                },
                info: {
                  light: '#64b5f6',
                  main: '#2196f3',
                  dark: '#1976d2',
                  contrastText: '#fff',
                  lighter: '#e3f2fd',
                  darker: '#0d47a1',
                  lighterChannel: 'e3f2fd',
                  darkerChannel: '0d47a1',
                },
                error: {
                  light: '#e57373',
                  main: '#f44336',
                  dark: '#d32f2f',
                  lighter: '#ffebee',
                  darker: '#b71c1c',
                  lighterChannel: 'ffebee',
                  darkerChannel: 'b71c1c',
                },
                // other palette properties...
                //                baseShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              },
            },
            dark: {
              // dark mode palette properties...
            },
          }, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
