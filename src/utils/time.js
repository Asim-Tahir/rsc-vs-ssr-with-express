/**
 * Artifical wait
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
