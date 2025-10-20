import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import type { Album } from "models/album.model.js";
import type { Song } from "models/song.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Artist {
  @prop({
    required: [true, "Artist name is required"],
    trim: true,
    type: () => String,
  })
  name!: string;

  @prop({ trim: true, type: () => String })
  bio!: string;

  @prop({
    type: () => String,
    default:
      "https://cdn.pixabay.com/photo/2024/09/17/23/23/studio-9054709_1280.jpg",
  })
  image!: string;

  @prop({ ref: "Song", type: () => String })
  genres!: Ref<Song>[];

  @prop({ default: 0, type: () => Number })
  followers!: number;

  @prop({ ref: "Album", type: () => String })
  albums!: Ref<Album>[];

  @prop({ default: false, type: () => Boolean })
  isVerified!: boolean;
}

export const ArtistModel = getModelForClass(Artist);
