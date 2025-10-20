import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import { Album } from "models/album.model.js";
import { Artist } from "models/artist.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Song {
  @prop({ required: [true, "Song title is required"], trim: true })
  title!: string;

  @prop({ ref: () => Artist, required: [true, "Artist is required"] })
  artist!: Ref<Artist>;

  @prop({ ref: () => Album })
  album!: Ref<Album>;

  @prop({ required: [true, "Duration is required"] })
  duration!: number;

  @prop({ required: [true, "Audio URL is required"] })
  audioUrl!: string;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2018/03/06/16/57/record-3203939_1280.jpg",
  })
  coverImage!: string;

  @prop({ default: Date.now })
  releaseDate!: Date;

  @prop({ trim: true })
  genre!: string;

  @prop({ default: 0 })
  plays!: number;

  @prop({ default: 0 })
  likes!: number;

  @prop({ default: false })
  isExplicit!: boolean;

  @prop({ ref: () => Artist })
  featuredArtists!: Ref<Artist>[];
}

export const SongModel = getModelForClass(Song);
