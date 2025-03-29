import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

export function formatDateTime(date?: string | Date): string {
  if (!date) return "";
  return dayjs(date).format("DD-MM-YYYY HH:mm:ss");
}

export function getCurrentYear(): string {
  return dayjs().format("BBBB");
}

export function getFullTextForecastYear(forecast?: number): string {
  const currentYear = Number(getCurrentYear()) + 1;
  const nextByForecast = currentYear + (forecast || 4);
  return `${currentYear} - ${nextByForecast}`;
}

export function formatDate(date?: string | Date, format = "DD-MM-YYYY"): string {
  if (!date) return "";
  return dayjs(date).format(format);
}
