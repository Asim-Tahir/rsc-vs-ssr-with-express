import { wait } from '#utils';

import bjorkPost from './bjork-post.json' with { type: 'json' };
import ladyGagaTheFame from './lady-gaga-the-fame.json' with { type: 'json' };
import glassAnimalsHowToBeAMHumanBeing from './glass-animals-how-to-be.json' with { type: 'json' };

/**
 * @typedef {{title: string, duration: string}} Song
 * @typedef {{id: string, artist: string, title: string, cover: string, songs: Array<Song>}} Album
 * @type {Array<Album>}
 */
const albums = [bjorkPost, ladyGagaTheFame, glassAnimalsHowToBeAMHumanBeing];

/**
 * @returns {Promise<Array<Album>>}
 */
export async function getAll() {
  await wait(2500);
  return albums;
}

/**
 * @param {string} id
 * @returns {Promise<Album | undefined>}
 */
export async function getById(id) {
  await wait(2000);
  return albums.find((album) => album.id === id);
}
