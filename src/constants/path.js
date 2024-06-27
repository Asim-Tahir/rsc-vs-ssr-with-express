import path from 'node:path';

export const ROOT_DIR = path.resolve('.');
export const CLIENT_DIR = path.join(ROOT_DIR, 'client');
export const APP_DIR = path.join(ROOT_DIR, 'app');
export const BUILD_DIR = path.join(ROOT_DIR, 'build');

export const CLIENT_MANIFEST_PATH = path.join(BUILD_DIR, 'client', 'client.manifest.json');
