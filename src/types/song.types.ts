import type { Song } from "models/song.model";

export type CreateSongData = Pick<
  Song,
  "title" | "artist" | "duration" | "audioUrl"
> &
  Partial<
    Pick<
      Song,
      | "album"
      | "coverImage"
      | "featuredArtists"
      | "genre"
      | "isExplicit"
      | "releaseDate"
    >
  >;

export type UpdateSongData = Partial<
  Pick<
    Song,
    | "album"
    | "artist"
    | "audioUrl"
    | "coverImage"
    | "featuredArtists"
    | "genre"
    | "isExplicit"
    | "title"
    | "releaseDate"
  >
>;

export type AddAlbumToSongData = {
  albumId: string;
};

export type AddArtistToSongData = {
  artistId: string;
};
