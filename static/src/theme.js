import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: { main: '#5557d9', dark: '#4042ad', contrastText: '#fff' },
    secondary: { main: '#5557d9' },
    success: { main: '#5557d9' },
    background: { default: '#f7f7fb', paper: '#ffffff' },
    text: { primary: '#222333', secondary: '#707184' },
  },
  typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44 } } },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: 'none' } } },
  },
});
