import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";

class Album {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  description!: string;

  @prop({ required: true, trim: true })
  image!: string;
}

export const AlbumModel = getModelForClass(Album);
