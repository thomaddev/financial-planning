import React from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { ControlProps, isStringControl, rankWith } from '@jsonforms/core'
import { Label } from '@vise/kit/form-elements'
import { StyleInput } from '@vise/kit/style'
/**
 * Custom Input Renderer for JSON Forms
 */
const InputRenderer = ({ data, handleChange, path, uischema, label, required }: ControlProps) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <Label label={label} required={required} path={path} />
      <StyleInput
        value={data || ''}
        onChange={(event) => handleChange(path, event.target.value)}
        placeholder={uischema?.options?.placeholder || ''}
      />
    </div>
  )
}

/**
 * Tester function for the custom input renderer
 */
export const inputControlTester = rankWith(2, isStringControl)

export default withJsonFormsControlProps(InputRenderer)
