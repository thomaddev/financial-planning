export interface TabType {
  label: string
  value: string
}

export interface TabsProps {
  tabIndex: string
  setTabIndex: (newValue: string) => void
  listTab: TabType[]
}
