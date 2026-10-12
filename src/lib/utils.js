/**
 * Generates a clean URL-safe alphanumeric code
 * Uses unambiguous characters (excluding easily confused 0, O, I, l)
 */
export function generateShortCode(length = 6) {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validates and normalizes user input into a proper URL
 */
export function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return null;

  let trimmed = input.trim();

  // If no scheme is provided, default to https://
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Must have a valid hostname with at least one dot (e.g. google.com) or localhost
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
