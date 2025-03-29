import { materialRenderers } from "@jsonforms/material-renderers";
import InputRenderer, { inputControlTester } from "./Input";
import PhoneInputRenderer, { phoneControlTester } from "./PhoneControl";
import NumberControl, { numberControlTester } from "./NumberControl";
import DateInputControl, { dateInputControlTester } from "./DateInputControl";
import SelectControl, { selectControlTester } from "./SelectControl";
import AutoCompleteControl, { autoCompleteControlTester } from "./AutoCompleteControl";

// ✅ Aggregate all custom renderers here
export const customRenderers = [
  ...materialRenderers,
  { tester: inputControlTester, renderer: InputRenderer },
  { tester: phoneControlTester, renderer: PhoneInputRenderer },
  { tester: numberControlTester, renderer: NumberControl },
  { tester: dateInputControlTester, renderer: DateInputControl },
  { tester: selectControlTester, renderer: SelectControl },
  { tester: autoCompleteControlTester, renderer: AutoCompleteControl },
  //   { tester: ratingControlTester, renderer: RatingControl },
];
