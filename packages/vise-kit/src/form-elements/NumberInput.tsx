import React from 'react'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleInput } from '@vise/kit/style'

// Define props interface for the pure component
interface NumberInputProps extends ControlledInputProps {
  variant?: 'number' | 'integer' // Replaces schema.type
  min?: number
  step?: number
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
  label,
  required = false,
  disabled = false,
  variant = 'number',
  min = 0,
  step,
  path,
}) => {
  const effectiveStep = step !== undefined ? step : variant === 'number' ? 0.01 : 1

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <StyleInput
        type="number"
        inputProps={{
          step: effectiveStep,
          min: min,
        }}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}

export default NumberInput
