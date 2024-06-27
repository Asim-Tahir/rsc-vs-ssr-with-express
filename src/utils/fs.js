import fs from 'node:fs';
import path from 'node:path';

/**
 * Ensure that the {@link dirOrPath directory or path} exists
 * @param {string} dirOrPath {@link dirOrPath directory or path} to ensure exists
 * @returns {boolean}
 */
export function ensureDirExist(dirOrPath) {
  try {
    const dir = path.dirname(dirOrPath);

    if (fs.existsSync(dir)) {
      return true;
    }

    fs.mkdirSync(dir, { recursive: true });

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ensure file exist
 * @param {string} filePath file path to ensure exist
 * @returns {boolean}
 */
export function ensureFileExist(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return true;
    }

    const dir = path.dirname(filePath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, '', { encoding: 'utf-8', flag: 'w' });

    return true;
  } catch (error) {
    return false;
  }
}
