import React from 'react';

import { albumDB } from '#server/db';

import Like from './Like.jsx';

export default async function Albums() {
  await albumDB.read();
  const albums = albumDB.data;

  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id} className="flex gap-2 items-center mb-2">
          <img
            className="w-20 aspect-square"
            src={album.cover}
            alt={`${album.title} - ${album.artist}`}
          />
          <div>
            <h3 className="text-xl">{album.title} - {album.artist}</h3>
            <p>{album.songs.length} songs</p>
            <Like album={album} />
          </div>
        </li>
      ))}
    </ul>
  );
}
