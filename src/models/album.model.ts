import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";
import type { Artist } from "models/artists.model.js";

export class Album {
  @prop({ required: [true, "Album Title is required"], trim: true })
  title!: string;

  @prop({ required: true, trim: true })
  artist!: Ref<Artist>;

  @prop({ required: true, trim: true })
  image!: string;
}

export const AlbumModel = getModelForClass(Album);
