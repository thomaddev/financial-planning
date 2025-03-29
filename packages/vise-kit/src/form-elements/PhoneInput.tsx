import React from 'react'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleInput } from '@vise/kit/style'

const PhoneInput: React.FC<ControlledInputProps> = ({
  value,
  setValue,
  label,
  required = false,
  placeholder = '',
  disabled = false,
  path,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Replace characters other than numbers & trim the value
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue.trim())
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <StyleInput
        onChange={handleChange}
        inputProps={{
          minLength: 0,
          maxLength: 10,
        }}
        value={value || ''}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default PhoneInput
