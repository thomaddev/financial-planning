import { ControlProps, isEnumControl, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { FormControl, InputAdornment, MenuItem, SelectChangeEvent } from '@mui/material'
import React from 'react'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import { Label } from '@vise/kit/form-elements'
import { StyleSelect } from '@vise/kit/style'

const SelectControl = ({
  data,
  handleChange,
  path,
  schema,
  label,
  required,
  uischema,
}: ControlProps) => {
  const options = schema?.enum ?? []

  const [disableInput, setDisableInput] = React.useState(false)
  const [adornment, setAdornment] = React.useState(false)

  const onChangeInput = (event: SelectChangeEvent<unknown>) => {
    handleChange(path, event.target.value)
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
          // hide arrow standardEndAdornment
          IconComponent={() => null}
          value={data ?? ''}
          onChange={onChangeInput}
          endAdornment={!adornment ? standardEndAdornment() : null}
          startAdornment={adornment ? standardEndAdornment() : null}
          displayEmpty={true}
          renderValue={(value) =>
            value && typeof value === 'string' && value.length ? (
              Array.isArray(value) ? (
                value.join(', ')
              ) : (
                value
              )
            ) : (
              <span className="hide-placeholder  text-[#9DA2AA]">{`${uischema?.options?.placeholder || ''}`}</span>
            )
          }
        >
          {options.map((value: string) => (
            <MenuItem key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </MenuItem>
          ))}
        </StyleSelect>
      </FormControl>
    </div>
  )
}

export const selectControlTester = rankWith(3, isEnumControl)

export default withJsonFormsControlProps(SelectControl)
