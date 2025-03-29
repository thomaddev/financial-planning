'use client'
import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'
import { usePlanFormStore } from '@/lib/stores/planFormStore'
const LayoutPlan = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const { resetPlan } = usePlanFormStore()
  useEffect(() => {
    // reset plan when not in update page
    if (pathname.endsWith('/my-board') || pathname.endsWith('/create')) {
      resetPlan()
    }
  }, [pathname, resetPlan])

  return (
    <React.Fragment>
      <div className="flex h-[calc(100vh-var(--header-height))]">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </React.Fragment>
  )
}

export default LayoutPlan
