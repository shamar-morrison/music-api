import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import type { Song } from "models/song.model.js";
import type { User } from "models/user.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Playlist {
  @prop({
    required: [true, "Playlist name is required"],
    trim: true,
    type: () => String,
  })
  name!: string;

  @prop({ trim: true, type: () => String })
  description!: string;

  @prop({
    type: () => String,
    default:
      "https://cdn.pixabay.com/photo/2021/07/11/16/02/freezelight-6404182_1280.jpg",
  })
  coverImage!: string;

  @prop({
    ref: "User",
    required: [true, "Creator is required"],
    type: () => String,
  })
  creator!: Ref<User>;

  @prop({ ref: "Song", type: () => String })
  songs!: Ref<Song>[];

  @prop({ default: false, type: () => Boolean })
  isPublic!: boolean;

  @prop({ default: 0, type: () => Number })
  followers!: number;

  @prop({ ref: "User", type: () => String })
  collaborators!: Ref<User>[];
}

export const PlaylistModel = getModelForClass(Playlist);
