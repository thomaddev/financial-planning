import { useTranslations } from 'next-intl';

export function useSafeTranslations(): any {
  try {
    return useTranslations(); // Try to use next-intl
  } catch (error) {
    console.warn('[next-intl] Missing translation context. Using fallback.');
    return (key: string) => key; // Return key as fallback text
  }
}
