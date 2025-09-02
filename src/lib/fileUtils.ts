/**
 * Robuuste sanitizeObjectKey voor Supabase Storage
 * NFKD-normaliseert, verwijdert onzichtbare/control-tekens, spaties vervangt,
 * alleen [a-zA-Z0-9._/-] toestaat, dubbele/leading/trailing slashes opruimt
 */
export function sanitizeObjectKey(fileName: string): string {
  // 1. NFKD normalisatie om gecombineerde karakters te decomposeren
  let sanitized = fileName.normalize('NFKD')
  
  // 2. Log de originele code points voor debugging
  console.log('Original fileName code points:', Array.from(fileName).map(char => 
    `${char} (U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')})`
  ))
  
  // 3. Verwijder alle onzichtbare/control karakters (inclusief soft hyphen \u00AD)
  sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F\u00AD\u200B-\u200D\uFEFF]/g, '')
  
  // 4. Vervang spaties en andere whitespace met underscores
  sanitized = sanitized.replace(/\s+/g, '_')
  
  // 5. Alleen [a-zA-Z0-9._/-] toestaan, rest vervangen met underscore
  sanitized = sanitized.replace(/[^a-zA-Z0-9._/-]/g, '_')
  
  // 6. Dubbele underscores vervangen met enkele
  sanitized = sanitized.replace(/_+/g, '_')
  
  // 7. Dubbele slashes vervangen met enkele
  sanitized = sanitized.replace(/\/+/g, '/')
  
  // 8. Leading/trailing underscores en slashes verwijderen
  sanitized = sanitized.replace(/^[_/]+|[_/]+$/g, '')
  
  // 9. Naar lowercase voor consistentie
  sanitized = sanitized.toLowerCase()
  
  // 10. Extra check: pad mag niet met / beginnen
  if (sanitized.startsWith('/')) {
    sanitized = sanitized.substring(1)
  }
  
  // 11. Backslashes vervangen met forward slashes
  sanitized = sanitized.replace(/\\/g, '/')
  
  console.log('Sanitized fileName:', sanitized)
  
  return sanitized
}

/**
 * Legacy functie voor backward compatibility
 * @deprecated Gebruik sanitizeObjectKey in plaats daarvan
 */
export function sanitizeFileName(fileName: string): string {
  return sanitizeObjectKey(fileName)
}

/**
 * Generates a safe file name for Supabase Storage met extra checks en fallbacks
 * Format: {inspirationId}/{timestamp}-{index}-{sanitizedFileName}
 */
export function generateStorageFileName(
  inspirationId: string,
  originalFileName: string,
  index: number = 0
): string {
  // 1. Sanitize de filename
  let sanitizedName = sanitizeObjectKey(originalFileName)
  
  // 2. Edge case: zeer lange namen (max 255 chars voor bestandsnamen)
  if (sanitizedName.length > 200) {
    const extension = getFileExtension(sanitizedName)
    const baseName = sanitizedName.substring(0, 200 - extension.length - 10) // 10 chars voor timestamp
    sanitizedName = `${baseName}_truncated${extension}`
  }
  
  // 3. Edge case: geen extensie - voeg .jpg toe als fallback
  if (!getFileExtension(sanitizedName)) {
    sanitizedName += '.jpg'
  }
  
  // 4. Edge case: lege naam na sanitization
  if (!sanitizedName || sanitizedName === '') {
    sanitizedName = `image_${index}.jpg`
  }
  
  // 5. Extra check: pad mag niet met / beginnen
  const cleanInspirationId = inspirationId.replace(/^\/+/, '')
  
  const timestamp = Date.now()
  const finalPath = `${cleanInspirationId}/${timestamp}-${index}-${sanitizedName}`
  
  // 6. Finale check: geen dubbele slashes
  return finalPath.replace(/\/+/g, '/')
}

/**
 * Helper functie om file extension te extraheren
 */
function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  return lastDot > 0 ? fileName.substring(lastDot) : ''
}

/**
 * Test functie om code points te loggen voor debugging
 * Gebruik deze om te zien welke verborgen karakters er in bestandsnamen zitten
 */
export function logFileNameCodePoints(fileName: string): void {
  console.log('=== File Name Code Points Analysis ===')
  console.log('Original fileName:', fileName)
  console.log('Length:', fileName.length)
  
  const codePoints = Array.from(fileName).map((char, index) => {
    const codePoint = char.codePointAt(0)
    const hex = codePoint?.toString(16).toUpperCase().padStart(4, '0')
    const isVisible = char.trim() !== '' && char !== '\u00AD' && char !== '\u200B'
    
    return {
      index,
      char,
      codePoint,
      hex: `U+${hex}`,
      isVisible,
      description: getCharacterDescription(codePoint || 0)
    }
  })
  
  console.table(codePoints)
  
  // Check voor specifieke problematische karakters
  const problematicChars = codePoints.filter(cp => 
    !cp.isVisible || 
    cp.codePoint === 0x00AD || // Soft hyphen
    cp.codePoint === 0x200B || // Zero-width space
    cp.codePoint === 0x200C || // Zero-width non-joiner
    cp.codePoint === 0x200D || // Zero-width joiner
    cp.codePoint === 0xFEFF    // Byte order mark
  )
  
  if (problematicChars.length > 0) {
    console.warn('⚠️ Problematische karakters gevonden:', problematicChars)
  } else {
    console.log('✅ Geen problematische karakters gevonden')
  }
}

/**
 * Helper functie om karakter beschrijvingen te geven
 */
function getCharacterDescription(codePoint: number): string {
  const descriptions: { [key: number]: string } = {
    0x00AD: 'Soft Hyphen',
    0x200B: 'Zero-width Space',
    0x200C: 'Zero-width Non-joiner',
    0x200D: 'Zero-width Joiner',
    0xFEFF: 'Byte Order Mark',
    0x0020: 'Space',
    0x00A0: 'Non-breaking Space'
  }
  
  return descriptions[codePoint] || 'Regular Character'
}
