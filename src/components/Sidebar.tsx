'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssessmentIcon from '@mui/icons-material/Assessment'

const menuItems = [
  {
    path: '/plan/create',
    icon: DashboardIcon,
    translationKey: 'planing',
  },
  {
    path: '/plan/my-board',
    icon: AssessmentIcon,
    translationKey: 'report',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  // Function to check if a path should be considered active
  const isPathActive = (itemPath: string) => {
    // If we're on an update path, we want the create path to be active
    if (pathname.endsWith('/update')) {
      return itemPath === '/plan/create'
    }
    // Otherwise, normal path matching
    return pathname.startsWith(itemPath)
  }

  return (
    <div className="w-full sm:w-[var(--sidebar-size)] bg-[var(--background-default-secondary)] flex flex-row sm:flex-col">
      {menuItems.map((item) => {
        const isActive = isPathActive(item.path)
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`relative flex items-center justify-center h-[var(--sidebar-size)] p-5 sm:p-0 transition-colors group
              ${isActive ? 'text-[var(--text-default-default)]' : 'text-[var(--text-default-secondary)] hover:text-[var(--text-default-default)]'}`}
          >
            <div
              className={`hidden sm:block absolute left-0 w-[3px] bg-[var(--background-brand-default)] transition-all duration-450 transform origin-top
              ${isActive ? 'opacity-100 translate-x-0 h-full' : 'opacity-0 -translate-x-3 h-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:h-full'}`}
            />
            <item.icon className="text-[24px]" />
          </Link>
        )
      })}
    </div>
  )
}
