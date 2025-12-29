import { createTheme } from '@mui/material/styles';

export const magicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold (Revelio Highlight)
    },
    secondary: {
      main: '#00e5ff', // Cyan (Magic Energy)
    },
    background: {
      default: '#0a0e17', // Deep Magic Blue
      paper: 'rgba(20, 30, 50, 0.6)', // Glassy Blue
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      letterSpacing: '0.1em',
      fontWeight: 'bold',
      color: '#FFD700',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 15, 30, 0.7)', // Glass Effect
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 215, 0, 0.3)', // Faint Gold Border
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          textTransform: 'none',
          fontSize: '1rem',
          backdropFilter: 'blur(5px)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #FFD700 30%, #FF8E53 90%)',
          color: '#000',
          fontWeight: 'bold',
        },
      },
    },
  },
});