/**
 * Formats a numeric value as a currency string using Thai Baht format.
 * @param params - The parameters for formatting the value.
 * @returns The formatted currency string.
 */
export const currencyFormatterForAggrid = (params: any) => {
    if (params.value === undefined) {
      return ''
    }
    // Extract the numeric value from the parameters
    const value = params.value; // Assuming the value is a number
  
    // Check if the value is not a number
    if (isNaN(value)) {
      return '0'; // Return an empty string for non-numeric values
    }
  
    // Format the numeric value as a currency string using Thai Baht format
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2, // Set the minimum number of fraction digits to 2
      maximumFractionDigits: 2, // Set the maximum number of fraction digits to 2
    }).format(value);
  };
  