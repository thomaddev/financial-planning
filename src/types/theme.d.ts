import '@mui/material/styles'; // Import the MUI module to augment

declare module '@mui/material/styles' {
  interface Palette {
    foreground: Palette['primary'];
    header: Palette['primary'];
    sidebar: Palette['primary'];
    menu_focus: Palette['primary'];
    menu_icon_bg: Palette['primary'];
    status_complete: Palette['primary'];
    status_waiting: Palette['primary'];
    status_cancel: Palette['primary'];
  }

  interface PaletteOptions {
    foreground: PaletteOptions['primary'];
    header: PaletteOptions['primary'];
    sidebar: PaletteOptions['primary'];
    menu_focus: PaletteOptions['primary'];
    menu_icon_bg: PaletteOptions['primary'];
    status_complete: PaletteOptions['primary'];
    status_waiting: PaletteOptions['primary'];
    status_cancel: PaletteOptions['primary'];
  }

  // Typography
  interface TypographyVariants {
    header_menu: React.CSSProperties;
    nav_menu_topic: React.CSSProperties;
    nav_menu_desc: React.CSSProperties;
    nav_menu_sub_topic: React.CSSProperties;
    nav_menu_sub_desc: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    header_menu?: React.CSSProperties;
    nav_menu_topic?: React.CSSProperties;
    nav_menu_desc?: React.CSSProperties;
    nav_menu_sub_topic?: React.CSSProperties;
    nav_menu_sub_desc?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    header_menu: true;
    nav_menu_topic: true;
    nav_menu_desc: true;
    nav_menu_sub_topic: true;
    nav_menu_sub_desc: true;
  }
}


declare module '@mui/material/styles' {
  interface Palette {
    button: Palette['primary']
    draft: Palette['primary']
    input: Palette['primary']
    table: Palette['primary']
    disable: Palette['primary']
    approve: Palette['primary']
    waitApprove: Palette['primary']
    cancel: Palette['primary']
  }

  interface PaletteOptions {
    button: PaletteOptions['primary']
    draft: PaletteOptions['primary']
    input: PaletteOptions['primary']
    table: PaletteOptions['primary']
    disable: PaletteOptions['primary']
    approve: PaletteOptions['primary']
    waitApprove: PaletteOptions['primary']
    cancel: PaletteOptions['primary']
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    title: React.CSSProperties
    topic: React.CSSProperties
    label: React.CSSProperties
    input: React.CSSProperties
    approve: React.CSSProperties
    waitApprove: React.CSSProperties
    cancel: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    title?: React.CSSProperties
    topic?: React.CSSProperties
    label?: React.CSSProperties
    input?: React.CSSProperties
    approve?: React.CSSProperties
    waitApprove?: React.CSSProperties
    cancel?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true
    topic: true
    label: true
    input: true
  }
}
