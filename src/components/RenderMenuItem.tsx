import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

interface RenderMenuItemProps {
  topic: string
  desc: string
  icon?: string
  isUnderline?: boolean
  isHoverDesc?: boolean
  isCenter?: boolean
}

const RenderMenuItem = ({
  topic,
  desc,
  icon,
  isUnderline = false,
  isHoverDesc = false,
  isCenter = false,
}: RenderMenuItemProps) => {
  return (
    <Box
      className="item-wrap"
      sx={{
        '&': {},
        '&:hover': {
          '.MuiSvgIcon-root': {
            color: 'var(--color-surface-primary)',
          },
          '.MuiTypography-nav_menu_topic': {
            // color: 'var(--color-surface-primary)',
            // textDecoration: 'underline #000000',
            textDecoration: isUnderline ? 'underline #000000' : 'none',
          },
          '.MuiTypography-nav_menu_desc': {
            // color: 'var(--color-text-primary)',
            color: isHoverDesc ? 'var(--color-text-primary)' : '',
          },
        },
      }}
    >
      <div className="menu-item">
        <div className={`flex gap-4 items-center ${isCenter ? 'justify-center' : 'justify-start'}`}>
          {icon && (
            <Image
              src={icon}
              priority
              alt="imageIcons"
              width={16}
              height={16}
              style={{ width: '16px', height: '16px' }}
            />
          )}
          <Typography variant={'nav_menu_topic'} component={'p'}>
            {topic}
          </Typography>
        </div>
        <Typography variant={'nav_menu_desc'}>{desc}</Typography>
      </div>
    </Box>
  )
}

export default RenderMenuItem
