import { getModelForClass, prop } from "@typegoose/typegoose";

export class Playlist {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  description!: string;

  @prop({ required: true, trim: true })
  image!: string;
}

export const PlaylistModel = getModelForClass(Playlist);
