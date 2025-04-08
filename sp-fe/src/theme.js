import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00b4d8',
        },
        secondary: {
            main: '#023047',
        },
        error: {
            main: '#e63946',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bbbbbb',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h6: {
            fontWeight: 'bold',
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
});

export default theme;
