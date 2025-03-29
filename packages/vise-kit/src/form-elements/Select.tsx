import { FormControl, InputAdornment, MenuItem, SelectChangeEvent } from '@mui/material'
import React from 'react'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { Label } from './Label'
import { ControlledInputProps } from '@vise/kit/types'
import { StyleSelect } from '@vise/kit/style'

// Define props interface for the pure component
interface SelectProps extends ControlledInputProps {
  options: string[]
  adornmentPosition?: 'start' | 'end'
}

const Select: React.FC<SelectProps> = ({
  value,
  setValue,
  label,
  options,
  required = false,
  disabled = false,
  placeholder = '',
  adornmentPosition = 'end',
  path,
}) => {
  const [disableInput] = React.useState(disabled)

  const onChangeInput = (event: SelectChangeEvent<unknown>) => {
    setValue(event.target.value as string)
  }

  const standardEndAdornment = (): React.ReactNode => (
    <InputAdornment position="end" className="pr-2">
      <KeyboardArrowDownOutlinedIcon fontSize="medium" color={disableInput ? 'disabled' : 'info'} />
    </InputAdornment>
  )

  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <FormControl
        fullWidth
        sx={{
          margin: 0,
          marginBottom: '2px',
        }}
      >
        <StyleSelect
          disabled={disableInput}
          IconComponent={() => null}
          value={value ?? ''}
          onChange={onChangeInput}
          endAdornment={adornmentPosition === 'end' ? standardEndAdornment() : null}
          startAdornment={adornmentPosition === 'start' ? standardEndAdornment() : null}
          displayEmpty={true}
          renderValue={(selected) =>
            selected && typeof selected === 'string' && selected.length ? (
              Array.isArray(selected) ? (
                selected.join(', ')
              ) : (
                selected
              )
            ) : (
              <span className="hide-placeholder text-[#9DA2AA]">{placeholder}</span>
            )
          }
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </StyleSelect>
      </FormControl>
    </div>
  )
}

export default Select
