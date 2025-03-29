import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface MenuItem {
  menu: string
  handleClick?: () => void
}

interface DropdownMenuProps {
  menuItems: MenuItem[] // รายการ MenuItem ที่จะแสดงในเมนู
  handleClose: () => void // ฟังก์ชันสำหรับปิดเมนู
  open: boolean // สถานะว่าเมนูเปิดหรือปิด (boolean)
  anchorEl: HTMLElement | null // element ที่ใช้กำหนดตำแหน่งของเมนู
  buttonName: string // ชื่อของปุ่ม
  endIcon: React.ReactNode // ไอคอนที่แสดงท้ายปุม (React node)
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  docStatus?: string | number
}

const DropdownMenu = ({
  menuItems, // รายการ MenuItem ที่จะแสดงในเมนู
  handleClose, // ฟังก์ชันสำหรับปิดเมนู
  open, // สถานะว่าเมนูเปิดหรือปิด (boolean)
  anchorEl, // element ที่ใช้กำหนดตำแหน่งของเมนู
  buttonName, // ชื่อของปุ่ม
  endIcon, // ไอคอนที่แสดงท้ายปุ่ม (React node)
  handleClick,
  docStatus,
}: DropdownMenuProps) => {
  return (
    <>
      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} // ถ้าไม่มี anchorEl ให้เรียก handleClose
        endIcon={endIcon}
        disabled={docStatus === 1}
        sx={{
          padding: '7px 20px',
          cursor: docStatus === 1 ? 'default' : 'pointer',
          textTransform: 'none',
          color: 'var(--text-brand-default)',
          fontFamily: 'var(--font-family-Kanit-Regular)',
          fontSize: 'var(--size-scale02, 14px)',
          fontWeight: 'var(--weight-weightregular, 400)',
        }}
      >
        {buttonName}
      </Button>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((item, index) => (
          <MenuItem
            sx={{
              padding: '7px 20px',
            }}
            key={index}
            onClick={item.handleClick}
            disabled={docStatus === 1}
          >
            {item.menu}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default DropdownMenu
