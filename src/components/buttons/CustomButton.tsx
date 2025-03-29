import React from 'react'
import { Button } from '@mui/material'

interface CustomButtonProps {
  variant?: 'text' | 'outlined' | 'contained'
  callFunction: () => void
  name: string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  callFunction,
  name,
  variant = 'contained',
}) => {
  return (
    <Button
      data-test="custom-btn"
      className="pointer-events-auto"
      variant={variant}
      onClick={callFunction}
    >
      {name}
    </Button>
  )
}

export default CustomButton
