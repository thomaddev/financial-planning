import React from 'react'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleInput } from '@vise/kit/style'

const TextInput = ({
  value,
  setValue,
  label,
  required = false,
  path,
  placeholder = '',
  disabled = false,
}: ControlledInputProps) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <StyleInput
        value={value || ''}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  )
}

export default TextInput
