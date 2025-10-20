import {
  prop,
  getModelForClass,
  type Ref,
  modelOptions,
} from "@typegoose/typegoose";
import type { Artist } from "./artist.model.js";
import type { Song } from "models/song.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Album {
  @prop({
    required: [true, "Album Title is required"],
    trim: true,
    type: () => String,
  })
  title!: string;

  @prop({ trim: true, type: () => String })
  description!: string;

  @prop({
    type: () => String,
    ref: "Artist",
    required: [true, "Artist is required"],
  })
  artist!: Ref<Artist>;

  @prop({ default: Date.now, type: () => Date })
  releaseDate!: Date;

  @prop({
    type: () => String,
    default:
      "https://cdn.pixabay.com/photo/2025/06/11/07/42/creepers-9653850_1280.jpg",
  })
  coverImage!: string;

  @prop({ ref: "Song", type: () => String })
  songs!: Ref<Song>[];

  @prop({ trim: true, type: () => String })
  genre!: string;

  @prop({ default: 0, type: () => Number })
  likes!: number;

  @prop({ default: false, type: () => Boolean })
  isExplicit!: boolean;
}

export const AlbumModel = getModelForClass(Album);
