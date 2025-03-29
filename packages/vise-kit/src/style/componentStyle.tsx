import { Autocomplete, InputBase, Select, styled } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export const StyleAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  '&.MuiInputBase-root': {
    backgroundColor: 'white',
  },
  backgroundColor: 'white',
  borderRadius: '8px',
  position: 'relative',
  boxShadow: 'none',
  color: '#9DA2AA',
  '&::placeholder': {
    color: theme.palette.input.main,
    opacity: 1,
    fontSize: theme.typography.label.fontSize,
  },
  'input, textarea': {
    padding: '10px',
    fontSize: theme.typography.input.fontSize,
    height: '28px',
    boxShadow: 'none',
    borderRadius: '4px',
  },
  '& .MuiInputAdornment-root p': {
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.input.main,
    zIndex: 10,
    '& .MuiInputAdornment-root p': {
      color: theme.palette.input.main,
    },
  },
  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
    '&:hover': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
  },
  '.select-caret': {
    right: '10px',
    svg: {
      color: theme.palette.primary.main,
      fontSize: '18px',
    },
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input::placeholder': {
    color: 'transparent',
  },
}))

export const StyleDatePicker = styled(DatePicker)(({}) => ({
  '.MuiInput-root, .MuiInputBase-root': {
    padding: '3px 10px',
    width: '100%',
    borderRadius: '8px',
    margin: '0px',
  },
}))

export const StyleInput = styled(InputBase)(({ theme }) => ({
  padding: '0px 10px',
  width: '100%',
  border: `1px solid ${theme.palette.input.main}`,
  borderRadius: '8px',
  position: 'relative',
  '&::placeholder': {
    color: theme.palette.input.main,
    opacity: 1,
    fontSize: theme.typography.label.fontSize,
  },
  'input, textarea': {
    padding: '10px',
    fontSize: theme.typography.input.fontSize,
  },
  '& .MuiInputAdornment-root p': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focused': {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'white',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.input.main,
    zIndex: 10,
    '& .MuiInputAdornment-root p': {
      color: theme.palette.input.main,
    },
  },
  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
    '&:hover': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
  },
  '.select-caret': {
    right: '10px',
    svg: {
      color: theme.palette.primary.main,
      fontSize: '18px',
    },
  },
}))

export const StyleSelect = styled(Select)(({ theme }) => ({
  '.MuiInput-root, .MuiInputBase-root': {
    backgroundColor: 'white',
  },
  padding: '0px 10px',
  width: '100%',
  height: '40px',
  border: `1px solid ${theme.palette.input.main}`,
  borderRadius: '8px',
  position: 'relative',
  backgroundColor: 'white',
  boxShadow: 'none',

  '&::placeholder': {
    color: theme.palette.input.main,
    opacity: 1,
    fontSize: theme.typography.label.fontSize,
  },
  'input, textarea': {
    padding: '10px',
    fontSize: theme.typography.input.fontSize,
    backgroundColor: 'white',
    boxShadow: 'none',
  },
  '& .MuiInputAdornment-root p': {
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.input.main,
    zIndex: 10,
    '& .MuiInputAdornment-root p': {
      color: theme.palette.input.main,
    },
  },
  '&.Mui-error': {
    border: `1px solid ${theme.palette.error.main}`,
    '&:hover': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.error.main}`,
      backgroundColor: 'transparent',
    },
  },
  '.select-caret': {
    right: '10px',
    svg: {
      color: theme.palette.primary.main,
      fontSize: '18px',
    },
  },
  '&.Mui-focused .hide-placeholder': {
    color: 'transparent',
  },
}))

