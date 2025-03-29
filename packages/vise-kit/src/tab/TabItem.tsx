interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
  }
  
  export default function TabItem(props: TabPanelProps) {
    const { children, value, index, ...other } = props
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {children}
      </div>
    )
  }
  