/**
 * Sanitizes a file name for safe storage in Supabase Storage
 * Removes special characters, spaces, and converts to lowercase
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase()
}

/**
 * Generates a safe file name for Supabase Storage
 * Format: {inspirationId}/{timestamp}-{index}-{sanitizedFileName}
 */
export function generateStorageFileName(
  inspirationId: string,
  originalFileName: string,
  index: number = 0
): string {
  const sanitizedName = sanitizeFileName(originalFileName)
  const timestamp = Date.now()
  return `${inspirationId}/${timestamp}-${index}-${sanitizedName}`
}
