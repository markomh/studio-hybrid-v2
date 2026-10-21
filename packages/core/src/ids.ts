/**
 * Generates a standard UUID v4 string.
 * Uses global crypto.randomUUID (standard Web & Node.js API).
 */
export function newId(): string {
  return crypto.randomUUID();
}
