import {
  prop,
  getModelForClass,
  type Ref,
  modelOptions,
} from "@typegoose/typegoose";
import { Artist } from "./artist.model.js";
import { Song } from "models/song.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Album {
  @prop({ required: [true, "Album Title is required"], trim: true })
  title!: string;

  @prop({ trim: true })
  description!: string;

  @prop({
    ref: () => Artist,
    required: [true, "Artist is required"],
  })
  artist!: Ref<Artist>;

  @prop({ default: Date.now })
  releaseDate!: Date;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2025/06/11/07/42/creepers-9653850_1280.jpg",
  })
  coverImage!: string;

  @prop({ ref: () => Song })
  songs!: Ref<Song>[];

  @prop({ trim: true })
  genre!: string;

  @prop({ default: 0 })
  likes!: number;

  @prop({ default: false })
  isExplicit!: boolean;
}

export const AlbumModel = getModelForClass(Album);
