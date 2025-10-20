import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Song {
  @prop({ required: [true, "Song title is required"], trim: true })
  title!: string;

  @prop({ required: true, trim: true })
  artist!: string;
}

export const SongModel = getModelForClass(Song);
