/**
 * Validates that all required fields are present in the request body
 * @param body - The request body object
 * @param requiredFields - Array of required field names
 * @returns Object with isValid boolean and missingFields array
 */
export const validateRequiredFields = (
  body: Record<string, any>,
  requiredFields: string[],
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
