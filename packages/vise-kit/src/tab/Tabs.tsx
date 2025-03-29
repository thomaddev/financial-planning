import { Tabs as TabsMui, Tab } from '@mui/material'
import { TabsProps } from '@vise/kit/interface'

const Tabs = ({ tabIndex, setTabIndex, listTab }: TabsProps) => {
  return (
    <TabsMui
      value={tabIndex}
      onChange={(_, newValue) => setTabIndex(newValue)}
      indicatorColor="primary"
      textColor="primary"
    >
      {listTab.map((tab) => (
        <Tab key={tab.value} label={tab.label} disableRipple value={tab.value} />
      ))}
    </TabsMui>
  )
}

export default Tabs
