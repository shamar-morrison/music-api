import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import { Song } from "models/song.model.js";
import { User } from "models/user.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Playlist {
  @prop({ required: [true, "Playlist name is required"], trim: true })
  name!: string;

  @prop({ trim: true })
  description!: string;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2021/07/11/16/02/freezelight-6404182_1280.jpg",
  })
  coverImage!: string;

  @prop({ ref: () => User, required: [true, "Creator is required"] })
  creator!: Ref<User>;

  @prop({ ref: () => Song })
  songs!: Ref<Song>[];

  @prop({ default: false })
  isPublic!: boolean;

  @prop({ default: 0 })
  followers!: number;

  @prop({ ref: () => User })
  collaborators!: Ref<User>[];
}

export const PlaylistModel = getModelForClass(Playlist);
