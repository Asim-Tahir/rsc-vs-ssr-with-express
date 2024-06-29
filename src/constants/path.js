import path from 'node:path';

export const ROOT_DIR = path.resolve('.');
export const CLIENT_DIR = path.join(ROOT_DIR, 'src', 'client');
export const SERVER_DIR = path.join(ROOT_DIR, 'src', 'server');
export const APP_DIR = path.join(ROOT_DIR, 'src', 'app');
export const BUILD_DIR = path.join(ROOT_DIR, 'build');
export const DB_DIR = path.join(SERVER_DIR, 'db');

export const CLIENT_MANIFEST_PATH = path.join(BUILD_DIR, 'client', 'client.manifest.json');

export const TODO_DB_PATH = path.join(DB_DIR, 'todo', 'data.json');
export const ALBUM_DB_PATH = path.join(DB_DIR, 'album', 'data.json');
