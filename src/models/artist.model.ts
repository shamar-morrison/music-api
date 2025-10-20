import { getModelForClass, prop, type Ref } from "@typegoose/typegoose";
import { Album } from "models/album.model.js";
import { Song } from "models/song.model.js";

export class Artist {
  @prop({ required: [true, "Artist name is required"], trim: true })
  name!: string;

  @prop({ trim: true })
  bio!: string;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2024/09/17/23/23/studio-9054709_1280.jpg",
  })
  image!: string;

  @prop({ ref: () => Song })
  genres!: Ref<Song>[];

  @prop({ default: 0 })
  followers!: number;

  @prop({ ref: () => Album })
  albums!: Ref<Album>[];

  @prop({ default: false })
  isVerified!: boolean;
}

export const ArtistModel = getModelForClass(Artist);
