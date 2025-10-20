import { getModelForClass, prop } from "@typegoose/typegoose";

export class Artist {
  @prop({ required: [true, "Artist name is required"], trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  description!: string;

  @prop({ required: true, trim: true })
  image!: string;
}

export const ArtistModel = getModelForClass(Artist);
