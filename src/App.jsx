import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import SLExtractionTable from './components/SLExtractionTable'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#222222' },
    secondary: { main: '#4a5568' },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2933',
      secondary: '#7a7a7a',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h5: { fontWeight: 700, letterSpacing: '0.3px' },
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
    subtitle2: { fontSize: 12, fontWeight: 600, letterSpacing: '0.4px' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.2px' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f7f7f7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#6b7280',
          fontWeight: 700,
          letterSpacing: '0.2px',
          textTransform: 'uppercase',
          fontSize: 12,
        },
        body: {
          color: '#1f2933',
          fontSize: 13,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#cbd5e1',
          '&.Mui-checked': { color: '#222222' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SLExtractionTable />
    </ThemeProvider>
  )
}

export default App
