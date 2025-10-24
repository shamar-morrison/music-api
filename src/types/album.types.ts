import type { Album } from "models/album.model";

/**
 * Type for the data to be used when creating a new album
 */
export type createAlbumData = Pick<
  Album,
  "title" | "description" | "artist" | "releaseDate"
> &
  Partial<
    Pick<Album, "coverImage" | "songs" | "genre" | "likes" | "isExplicit">
  >;
