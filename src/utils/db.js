import { randomBytes } from 'node:crypto';

/**
 * Generate random 6 digit id
 * @example "fcbfb2"
 * @returns {string}
 */
export function generateId() {
  return randomBytes(3).toString('hex');
}
