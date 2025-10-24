import type { Artist } from "../models/artist.model.js";

/**
 * Type for updating artist properties - includes all Artist properties
 */
export type UpdateArtistData = Partial<Artist>;

/**
 * Type for creating a new artist - makes certain fields required
 */
export type CreateArtistData = Pick<Artist, "name" | "bio"> &
  Partial<
    Pick<Artist, "genres" | "image" | "followers" | "albums" | "isVerified">
  >;
