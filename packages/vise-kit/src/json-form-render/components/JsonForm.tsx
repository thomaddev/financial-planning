import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers, materialCells } from "@jsonforms/material-renderers";
import { JsonFormProps } from "@vise/kit";

const JsonForm: React.FC<JsonFormProps> = ({ schema, uischema, formData = {}, onChange }) => {
  const [data, setData] = useState<object>(formData);

  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={({ data }) => {
        setData(data);
        if (onChange) onChange(data);
      }}
    />
  );
};

export default JsonForm;