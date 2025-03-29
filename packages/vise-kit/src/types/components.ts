export type ControlledInputProps = {
  value: string | null | number;
  setValue: (value: string | null) => void;
  label: string;
  path: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};
