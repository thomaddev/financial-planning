import React from 'react'

type Props = {
  title: string
  status: 'success' | 'info' | 'warning' | 'danger' | 'secondary'
  radius?: 'sm' | 'xl'
}

const LableStatus = ({ title, status, radius = 'xl' }: Props) => {
  const baseClasses = 'h-[26px] flex justify-center items-center w-full px-[10px] py-[4px]'

  const statusStyles = {
    success: 'bg-[var(--background-positive-default)] text-[var(--text-positive-default)]',
    info: 'bg-[var(--background-brand-default)] text-[var(--text-default-white)]',
    warning: 'bg-[var(--background-warning-default)] text-[var(--text-warning-default)]',
    danger: 'bg-[var(--background-negative-default)] text-[var(--text-negative-default)]',
    secondary: 'bg-[var(--background-default-secondary)] text-[var(--text-default-secondary)]',
  }

  const radiusStyles = {
    sm: 'rounded-[5px]',
    xl: 'rounded-2xl',
  }

  // Combine all classes
  const className = `${baseClasses} ${statusStyles[status]} ${radiusStyles[radius]}`

  return <div className={className}>{title}</div>
}

export default LableStatus
