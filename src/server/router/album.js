import express from 'express';

import { albumDB } from '#server/db';
import { ALBUM_ERRORS } from '#server/errors';

const albumRouter = express.Router();

albumRouter.use(express.json());

albumRouter.get('/', async (req, res) => {
  try {
    await albumDB.read();

    res.status(200).json(albumDB.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: JSON.stringify(error) });
    }
  }
});

albumRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { artist, title, cover, likes, songs } =
    /** @type {Album.Payload.UpdateAlbumItem} */ (req.body);

  try {
    await albumDB.read();

    const albums = albumDB.data;

    const toBeUpdatedAlbumIndex = albums.findIndex((album) => album.id === id);
    const toBeUpdatedAlbum = albums[toBeUpdatedAlbumIndex];

    if (toBeUpdatedAlbumIndex < 0) {
      const error = ALBUM_ERRORS.NOT_EXIST_ERROR(id);

      res.status(400).json({ error });
      next(error);
    }

    /** @type {Album.AlbumItem} */
    const updatedAlbum = {
      id,
      artist: toBeUpdatedAlbum.artist,
      title: toBeUpdatedAlbum.title,
      cover: toBeUpdatedAlbum.cover,
      likes: likes ?? toBeUpdatedAlbum.likes,
      songs:
        Array.isArray(songs) && songs.length > 0
          ? toBeUpdatedAlbum.songs.concat(songs)
          : toBeUpdatedAlbum.songs
    };

    await albumDB.update((todos) => {
      if (toBeUpdatedAlbumIndex >= 0) {
        todos[toBeUpdatedAlbumIndex] = updatedAlbum;
      }
    });

    res.status(200).json(updatedAlbum);
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      next(error.message);
    } else {
      const errorMsg = JSON.stringify(error);

      res.status(500).json({ error: errorMsg });
      next(errorMsg);
    }
  }
});

albumRouter.get('/:id/like', async (req, res, next) => {
  const { id } = req.params;

  try {
    await albumDB.read();

    const albums = albumDB.data;

    const toBeUpdatedAlbumIndex = albums.findIndex((album) => album.id === id);
    const toBeUpdatedAlbum = albums[toBeUpdatedAlbumIndex];

    if (toBeUpdatedAlbumIndex < 0) {
      const error = ALBUM_ERRORS.NOT_EXIST_ERROR(id);

      res.status(400).json({ error });
      next(error);
    }

    /** @type {Album.AlbumItem} */
    const updatedAlbum = {
      id,
      artist: toBeUpdatedAlbum.artist,
      title: toBeUpdatedAlbum.title,
      cover: toBeUpdatedAlbum.cover,
      likes: toBeUpdatedAlbum.likes + 1,
      songs: toBeUpdatedAlbum.songs
    };

    await albumDB.update((todos) => {
      if (toBeUpdatedAlbumIndex >= 0) {
        todos[toBeUpdatedAlbumIndex] = updatedAlbum;
      }
    });

    res.status(200).json(updatedAlbum);
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      next(error.message);
    } else {
      const errorMsg = JSON.stringify(error);

      res.status(500).json({ error: errorMsg });
      next(errorMsg);
    }
  }
});

export default albumRouter;
