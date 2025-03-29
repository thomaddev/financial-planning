import { TabsProps } from '@vise/kit/interface'
import { TabItem, Tabs } from '@vise/kit/tab'
import React from 'react'

interface TabWrapperProps extends TabsProps {
  tabIndex: string
  listTab: { label: string; value: string }[]
  children: React.ReactNode[]
}

const TabWrapper = ({ tabIndex, setTabIndex, listTab, children }: TabWrapperProps) => {
  return (
    <>
      <Tabs tabIndex={tabIndex} setTabIndex={setTabIndex} listTab={listTab} />

      {listTab.map((tab, index) => (
        <TabItem key={tab.value} value={Number(tabIndex) - 1} index={index}>
          {children[index]}
        </TabItem>
      ))}
    </>
  )
}

export default TabWrapper
