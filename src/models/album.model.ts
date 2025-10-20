import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";

export class Album {
  @prop({ required: [true, "Album Title is required"], trim: true })
  title!: string;

  @prop({ required: true, trim: true })
  description!: string;

  @prop({ required: true, trim: true })
  image!: string;
}

export const AlbumModel = getModelForClass(Album);
