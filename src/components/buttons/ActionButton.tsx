import { Button, Typography } from '@mui/material'
import React from 'react'

type Props = {
  name: string
  onClick?: () => void
  variant?: 'info' | 'error'
  disabled?: boolean
}
// bg-[var(--background-default-secondary)]
const ActionButton = ({ name, onClick = () => {}, variant = 'info', disabled }: Props) => {
  return (
    <Button
      sx={{
        width: '100px',
        height: '40px',
        backgroundColor:
          variant === 'info' && !disabled
            ? 'var(--text-brand-default)'
            : disabled
              ? 'var(--background-default-secondary)'
              : 'var(--text-negative-default)',
        borderRadius: '7px',
      }}
      onClick={onClick}
      color={variant}
      disabled={disabled}
    >
      <Typography
        className={`capitalize ${disabled ? 'text-[var(--text-default-secondary]' : 'text-[var(--text-default-white)]'}`}
      >
        {name}
      </Typography>
    </Button>
  )
}

export default ActionButton
