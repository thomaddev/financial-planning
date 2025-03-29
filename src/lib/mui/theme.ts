import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0D89F2' },
    secondary: { main: '#3B445A' },
    sidebar: { main: '#2D384A' },
    header: { main: '#FFFFFF' },
    foreground: { main: '#F0F3F6' },
    menu_focus: { main: '#404A5F' },
    menu_icon_bg: { main: '#E0E0E0' },
    status_complete: { main: '#E0E0E0' },
    status_waiting: { main: '#E0E0E0' },
    status_cancel: { main: '#E0E0E0' },
    input: {
      main: '#DADBE2',
    },
    table: {
      main: '#EFF3F8',
    },
    disable: {
      main: '#e7e7e7',
    },
    approve: {
      main: '#C9F1E8',
    },
    waitApprove: {
      main: '#FFEFD6',
    },
    cancel: {
      main: '#F7E7E7',
    },
    button: {
      main: '#2463EB',
    },
    draft: {
      main: '#C0C0C0',
    },
  },
  typography: {
    fontFamily: 'var(--font-family-Kanit-Regular)',
    // Use In System name
    h1: {
      fontSize: '18px',
      fontWeight: '500',
      color: 'var(--tokens-color-primary-blue)',
    },
    h2: {
      fontSize: '18px',
      fontWeight: '500',
      color: 'var(--tokens-color-primary-black)',
    },
    h3: {
      fontSize: '18px',
      fontWeight: '500',
      color: 'var(--collection-1-black)',
      paddingTop: 5,
      paddingBottom: 34,
    },
    h4: {
      fontSize: '14px',
      fontWeight: '300',
    },
    caption: {
      fontSize: 'var(--description-size)',
      fontWeight: '400',
      color: 'var(--text-default-secondary)',
    },
    subtitle1: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '18px',
      color: 'var(--color-text-desc)',
    },
    header_menu: {
      fontFamily: 'var(--font-family-Kanit-Regular)',
      fontSize: '14px',
      color: 'var(--tokens-color-primary-black)',
    },
    nav_menu_topic: {
      fontFamily: 'var(--font-family-Kanit-Regular)',
      fontSize: '16px',
      fontWeight: 600,
      color: '#000',
    },
    nav_menu_desc: {
      fontSize: '14px',
      color: '#677489',
    },
    nav_menu_sub_topic: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#000',
    },
    nav_menu_sub_desc: {
      fontSize: '14px',
      color: '#677489',
    },
    label: {
      fontSize: '14px',
      color: '#141414',
    },
    input: {
      fontSize: '14px',
      color: '#141414',
    },
    approve: {
      color: '#159375',
    },
    waitApprove: {
      color: '#F77112',
    },
    cancel: {
      color: '#D84C10',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width: 1536px)': {
            // maxWidth: '100%',
            paddingLeft: '39px',
            paddingRight: '39px',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {},
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          marginBottom: '1rem',
          label: {
            position: 'relative',
            // display: 'none',
            width: 'auto',
            transform: 'translate(0, 0) scale(1)',
            color: 'var(--color-text-desc)',

            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: '19.6px',
            paddingBottom: 6,
            '&.Mui-focused': {
              color: 'black',
            },
            '&.Mui-error': {
              color: 'var(--color-text-primary)',
            },
          },
          '.MuiInput-root, .MuiInputBase-root': {
            borderRadius: 5,
            backgroundColor: 'var(--white-90)',

            border: '1px solid var(--color-input-stroke)',
            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
            padding: '0',
            marginTop: 0,
            marginBottom: '20px',
            input: {
              fontSize: 'var(--text-base)',
              padding: 'var(--input-padding)',
              '&:-webkit-autofill': {
                WebkitBackgroundClip: 'text',
              },
            },
            textarea: {
              fontSize: 'var(--text-base)',
              padding: 'var(--input-padding)',
            },
            '&.Mui-focused': {
              border: '1px solid var(--color-surface-primary)',
            },
            '&.Mui-disabled': {
              background: 'var(--color-bg-menu)',
            },
            '&.Mui-error': {
              border: '1px solid var(--color-red-red-100)',
            },
            '::placeholder': {
              color: 'var(--color-text-placeholder)',
            },
          },
          'label+.MuiInput-root': {
            marginTop: 0,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: 'var(--color-red-red-100)',

            fontSize: '12px',
            fontWeight: 400,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fieldset: {
            display: 'none',
          },
          input: {
            // ...inputStyle,
            padding: 'var(--input-padding)',
          },
          // '::placeholder': {
          //   color: 'var(--color-text-placeholder)',
          // },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          // backgroundColor: 'var(--white-90)',

          // border: '1px solid',
          // borderColor: 'var(--color-input-stroke)',
          // borderRadius: 5,
          // height: '42px',
          // padding: '0',
          // marginTop: 0,
          marginBottom: 20,
          fieldset: {
            display: 'none',
          },
          input: {
            // ...inputStyle,
            padding: 'var(--input-padding)',
          },
          ':before, :after': { display: 'none' },
          // '::placeholder': {
          //   color: 'var(--color-text-placeholder)',
          // },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          textTransform: 'capitalize',
          color: 'var(--tokens-color-primary-black)',
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--tokens-color-primary-blue)',
          },
          '&.Mui-selected': {
            background: 'transparent',
            color: 'var(--tokens-color-primary-blue)',
          },
        },
        root: {
          '.MuiInputBase-root': {
            padding: 0,
          },
          'input.MuiAutocomplete-input': {
            fontSize: 'var(--text-base)',
            padding: 'var(--input-padding) !important',
          },
          '.MuiAutocomplete-endAdornment': {
            right: 9,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          color: 'var(--tokens-color-primary-black)',
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--tokens-color-primary-blue)',
          },
          '&.Mui-selected': {
            background: 'transparent',
            color: 'var(--tokens-color-primary-blue)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          color: 'var(--tokens-color-primary-black)',
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--text-brand-default)',
          },
          '&.Mui-selected': {
            background: 'transparent',
            color: 'var(--text-brand-default)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {},
      variants: [
        {
          props: { variant: 'header_menu' },
          style: {
            ':hover': {
              fontWeight: '600',
            },
          },
        },
      ],
    },
    MuiTab: {
      styleOverrides: {
        root: {
          // marginBottom: 10
          // color: 'var(--collection-1-black)',
          // fontSize: 14,
          // fontWeight: 400,
          // lineHeight: '21px',
          // minWidth: 'auto',
          // padding: 0,
          // marginRight: '26px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
          borderColor: 'var(--color-line-Stroke)',
          marginBottom: 20,
          // height: '40px',
          // minHeight: '30px',
          '.MuiTab-root': {
            color: 'var(--collection-1-black)',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '21px',
            minWidth: 'auto',
            padding: 0,
            marginRight: '26px',
            textTransform: 'capitalize',
            '&.Mui-selected': {
              color: 'var(--color-surface-primary)',
            },
          },
          '.MuiTabs-indicator': {
            backgroundColor: 'var(--color-surface-primary)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
          border: '1px solid var(--color-input-stroke)',
          color: 'var(--color-text-primary)',
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: 'var(--color-bg-primary)',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '150%',
            border: '1px solid var(--color-surface-primary)',
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            color: 'var(--color-surface-primary)',
          },
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          // override tabs in dialog for JsonForm render
          '.MuiDialog-paper': {
            // padding: '24px',
            borderRadius: 'var(--size-scale05)',
          },
          '.MuiAppBar-root': {
            background: 'transparent',
            boxShadow: 'none',
            paddingTop: 'var(--space-ag-cell-horizontal-padding)',
            paddingBottom: 'var(--space-ag-cell-horizontal-padding)',
          },
          '.MuiFormControl-root ': {
            // paddingTop: 'var(--padding-top-form-control-dialog)',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '34px 21px 34px 21px',
          fontSize: '16px',
          fontWeight: '500',
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '34px 21px 20px 21px',
          overflow: 'hidden',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: '400',
          color: 'var(--color-text-desc)',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '20px 21px 34px 21px',
          '.MuiButton-root': {
            width: '100%',
            borderRadius: 8,
            minHeight: '40px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          // minHeight: '90px',
          // padding: '23px',
          // backgroundColor: 'var(--color-bg-primary)',
          // '&:hover': {
          //   backgroundColor: 'var(--color-bg-primary-hover)',
          // },
        },
      },
    },
  },
})

export default theme
