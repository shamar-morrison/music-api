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

/**
 * Validates that all required fields are present, including file fields
 * @param body - The request body object
 * @param files - The request files object (from multer)
 * @param requiredFields - Array of required field names
 * @param fileFields - Array of field names that are expected to be files
 * @returns Object with isValid boolean and missingFields array
 */
export const validateRequiredFieldsWithFiles = (
  body: Record<string, any>,
  files: any,
  requiredFields: string[],
  fileFields: string[] = [],
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  // Check regular fields
  const regularFields = requiredFields.filter(
    (field) => !fileFields.includes(field),
  );
  const missingRegularFields = regularFields.filter(
    (field) =>
      body[field] === undefined || body[field] === null || body[field] === "",
  );
  missingFields.push(...missingRegularFields);

  // Check file fields
  const missingFileFields = fileFields.filter((field) => {
    if (!files) return true;

    // Handle single file uploads
    if (files[field]) {
      return files[field].length === 0;
    }

    // Handle multiple file uploads (fields array)
    if (Array.isArray(files)) {
      return !files.some((file: any) => file.fieldname === field);
    }

    return true;
  });
  missingFields.push(...missingFileFields);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};
