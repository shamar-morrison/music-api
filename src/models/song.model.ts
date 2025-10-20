import { getModelForClass, prop } from "@typegoose/typegoose";

export class Song {
  @prop({ required: [true, "Song title is required"], trim: true })
  title!: string;

  @prop({ required: true, trim: true })
  artist!: string;
}

export const SongModel = getModelForClass(Song);
