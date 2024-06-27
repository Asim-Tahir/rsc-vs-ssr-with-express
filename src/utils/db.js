import { JSONFilePreset } from 'lowdb/node';

import { CLIENT_MANIFEST_PATH } from '#constants';

/**
 * @typedef {{id: string, name: string, chunks: Array<string>, async: boolean}} ClientManifest
 * @type {import('lowdb').Low<Record<string, ClientManifest>>}
 */
export const clientManifestDB = await JSONFilePreset(CLIENT_MANIFEST_PATH, {});
