import { IconButton } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { useState } from 'react'

type Props = {
  title: string
  toggle: () => void
  initialExpanded?: boolean // เพิ่ม prop ใหม่ โดย optional และ default เป็น true
}

const HeaderExtend = ({ title, toggle, initialExpanded = true }: Props) => {
  const [expanded, setExpanded] = useState(initialExpanded)

  const handleToggle = () => {
    toggle() // เรียก toggle โดยส่ง gridApi
    setExpanded((prev) => !prev) // อัปเดตสถานะท้องถิ่น
  }
  return (
    <div className="flex justify-between items-center">
      <span className="text-[length:var(--size-scale01)] font-[family-name:var(--font-family-Kanit-Regular)]">
        {title}
      </span>
      <IconButton disableRipple onClick={handleToggle}>
        {expanded ? (
          <KeyboardArrowLeftIcon
            sx={{
              color: 'var(--text-brand-default)',
              fontSize: '24px',
            }}
          />
        ) : (
          <KeyboardArrowRightIcon
            sx={{
              color: 'var(--text-brand-default)',
              fontSize: '24px',
            }}
          />
        )}
      </IconButton>
    </div>
  )
}

export default HeaderExtend
