import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";
import { Artist } from "./artists.model.js";

export class Album {
  @prop({ required: [true, "Album Title is required"], trim: true })
  title!: string;

  @prop({
    ref: () => Artist,
    required: [true, "Artist is required"],
    type: () => String,
  })
  artist!: Ref<Artist>;

  @prop({ default: Date.now })
  releaseDate!: Date;
}

export const AlbumModel = getModelForClass(Album);
