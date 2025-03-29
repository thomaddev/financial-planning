import React from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { ControlProps, or, rankWith, scopeEndsWith } from '@jsonforms/core'
import { Label } from '@vise/kit/form-elements'
import { StyleInput } from '@vise/kit/style'

const PhoneInputRenderer = ({
  data,
  handleChange,
  path,
  uischema,
  label,
  required,
}: ControlProps) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <StyleInput
        onChange={(event) => {
          // replace characters other than numbers & trim the value
          const value = event.target.value.replace(/[^0-9]/g, '')
          handleChange(path, value.trim())
        }}
        inputProps={
          // minlength : 0 to 10
          { minLength: 0, maxLength: 10 }
        }
        value={data || ''}
        placeholder={uischema?.options?.placeholder || ''}
      />
    </div>
  )
}

export const phoneControlTester = rankWith(2, or(scopeEndsWith('_phone_number')))

export default withJsonFormsControlProps(PhoneInputRenderer)
