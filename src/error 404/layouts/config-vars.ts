import type { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { varAlpha } from 'error 404/theme/styles';
import { alpha } from '@mui/material';
import { hexToRgb } from '@mui/system';

// ----------------------------------------------------------------------
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db',
      contrastText: '#fff',
    } as any, // Temporary workaround to bypass TypeScript errors
  },
});
const primaryRGB = hexToRgb(theme.palette.primary.main);
const primaryAlpha = alpha(primaryRGB, 0.08); // Adjust opacity

export const baseVars = (theme: Theme) => ({
  // nav
  '--layout-nav-bg': theme.palette.common.white,
  '--layout-nav-border-color': varAlpha((theme.palette.grey as any)['500Channel'], 0.08),
  '--layout-nav-zIndex': 1101,
  '--layout-nav-mobile-width': '320px',
  // nav item
  '--layout-nav-item-height': '44px',
  '--layout-nav-item-color': theme.palette.text.secondary,
  '--layout-nav-item-active-color': theme.palette.primary.main,
  '--layout-nav-item-active-bg': varAlpha(theme.palette.primary.main, 0.08),
  '--layout-nav-item-hover-bg': varAlpha(theme.palette.primary.main, 0.16),
  // header
  '--layout-header-blur': '8px',
  '--layout-header-zIndex': 1100,
  '--layout-header-mobile-height': '64px',
  '--layout-header-desktop-height': '72px',
});
