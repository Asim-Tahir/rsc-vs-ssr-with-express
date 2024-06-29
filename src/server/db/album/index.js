import { JSONFilePreset } from 'lowdb/node';

import { ALBUM_DB_PATH } from '#constants';

/**
 * @type {import('lowdb').Low<Array<Album.AlbumItem>>}
 */
const albumDB = await JSONFilePreset(
  ALBUM_DB_PATH,
  /** @type {Array<Album.AlbumItem>} */ ([])
);

export default albumDB;
