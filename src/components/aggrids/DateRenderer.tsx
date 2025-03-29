import { useMemo } from "react";
import { formatDateTime } from "@vise/kit"; 
export default function DateRenderer({ value }: { value: string }) {
  const formattedDate = useMemo(() => (value ? formatDateTime(value) : ""), [value]);

  return <>{formattedDate}</>;
}

