'use client';

import consola from 'consola';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {object} props
 * @param {Album.AlbumItem} props.album
 */
export default function Like({ album }) {
  const [likes, setLikes] = useState(album.likes);
  const [loading, setLoading] = useState(false);

  async function like() {
    try {
      setLoading(true);

      const res = await fetch(`/api/albums/${album.id}/like`);

      if (res.ok) {
        /**
         * @type {Album.AlbumItem}
         */
        const album = await res.json();

        setLoading(false);
        setLikes(album?.likes ?? 0);
      }
    } catch (error) {
      consola.error(
        `Error occur while liking ${album.title} - ${album.artist}" album`,
        error
      );
    }
  }

  return (
    <button onClick={() => like()}>
      {loading ? '💗' : '🩷'} {likes}
    </button>
  );
}

Like.propTypes = {
  album: PropTypes.object
};
