declare namespace Album {
  interface Song {
    title: string;
    duration: string;
  }

  interface AlbumItem {
    id: string;
    artist: string;
    title: string;
    cover: string;
    likes: number;
    songs: Array<Song>;
  }

  namespace Payload {
    type UpdateAlbumItem = Partial<Omit<AlbumItem, 'id'>>;
  }
}
