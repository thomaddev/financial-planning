import React from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { ControlProps, isIntegerControl, isNumberControl, or, rankWith } from '@jsonforms/core'
import { Label } from '@vise/kit/form-elements'
import { StyleInput } from '@vise/kit/style'

const NumberControl = ({ data, handleChange, path, schema, label, required }: ControlProps) => {
  const isNumberField = schema?.type === 'number'
  const isIntegerField = schema?.type === 'integer'

  const step = isNumberField ? 0.01 : 1
  const min = 0
  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      {isNumberField && (
        <StyleInput
          type="number"
          inputProps={{
            step: step,
            min: min,
          }}
          value={data || ''}
          onChange={(event) => handleChange(path, Number(event.target.value))}
        />
      )}

      {isIntegerField && (
        <StyleInput
          type="number"
          inputProps={{
            step: 1,
            min: 0,
          }}
          value={data || ''}
          onChange={(event) => handleChange(path, Number(event.target.value))}
        />
      )}
    </div>
  )
}

/**
 * Tester function for the custom input renderer
 */
export const numberControlTester = rankWith(3, or(isIntegerControl, isNumberControl))

export default withJsonFormsControlProps(NumberControl)
