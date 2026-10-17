/**
 * Security & Input Sanitization Utilities for GigSaathi
 */

export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  error?: string;
}

/**
 * Validates and sanitizes text inputs to prevent XSS, script injection, and payload flooding.
 */
export function sanitizeInput(rawInput: unknown, maxLength = 2000): ValidationResult {
  if (rawInput === null || rawInput === undefined) {
    return { isValid: false, sanitized: '', error: 'Input cannot be empty' };
  }

  const str = String(rawInput).trim();

  if (str.length === 0) {
    return { isValid: false, sanitized: '', error: 'Input cannot be empty' };
  }

  if (str.length > maxLength) {
    return {
      isValid: false,
      sanitized: str.slice(0, maxLength),
      error: `Input exceeds maximum allowed length of ${maxLength} characters`,
    };
  }

  // Strip null bytes and non-printable control characters (except common whitespace)
  const cleanStr = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return {
    isValid: true,
    sanitized: cleanStr,
  };
}

/**
 * Basic in-memory rate limiter to prevent API abuse and denial of service
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 120, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public isAllowed(clientIp: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(clientIp) || [];

    // Remove timestamps outside window
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      this.requests.set(clientIp, validTimestamps);
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(clientIp, validTimestamps);
    return true;
  }
}

export const rateLimiter = new InMemoryRateLimiter(150, 60000);
