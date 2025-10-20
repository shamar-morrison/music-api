import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import type { Album } from "models/album.model.js";
import type { Artist } from "models/artist.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Song {
  @prop({
    required: [true, "Song title is required"],
    trim: true,
    type: () => String,
  })
  title!: string;

  @prop({
    ref: "Artist",
    required: [true, "Artist is required"],
    type: () => String,
  })
  artist!: Ref<Artist>;

  @prop({ ref: "Album", type: () => String })
  album!: Ref<Album>;

  @prop({ required: [true, "Duration is required"], type: () => Number })
  duration!: number;

  @prop({ required: [true, "Audio URL is required"], type: () => String })
  audioUrl!: string;

  @prop({
    type: () => String,
    default:
      "https://cdn.pixabay.com/photo/2018/03/06/16/57/record-3203939_1280.jpg",
  })
  coverImage!: string;

  @prop({ default: Date.now, type: () => Date })
  releaseDate!: Date;

  @prop({ trim: true, type: () => String })
  genre!: string;

  @prop({ default: 0, type: () => Number })
  plays!: number;

  @prop({ default: 0, type: () => Number })
  likes!: number;

  @prop({ default: false, type: () => Boolean })
  isExplicit!: boolean;

  @prop({ ref: "Artist", type: () => String })
  featuredArtists!: Ref<Artist>[];
}

export const SongModel = getModelForClass(Song);
