import {
  prop,
  getModelForClass,
  type Ref,
  modelOptions,
  pre,
} from "@typegoose/typegoose";
import type { Song } from "./song.model.js";
import type { Album } from "./album.model.js";
import type { Artist } from "./artist.model.js";
import type { Playlist } from "./playlist.model.js";
import { hash } from "bcrypt";

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) return;

  const saltRounds = 12;
  this.password = await hash(this.password, saltRounds);
  next();
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({
    required: [true, "Name is required"],
    trim: true,
    type: () => String,
  })
  name!: string;

  @prop({
    required: [true, "Email is required"],
    unique: true,
    type: () => String,
  })
  email!: string;

  @prop({
    required: [true, "Password is required"],
    minlength: [6, "Password has to be at least 6 characters long"],
    type: () => String,
  })
  password!: string;

  @prop({
    type: () => String,
    default:
      "https://cdn.pixabay.com/photo/2023/12/15/21/47/cat-8451431_1280.jpg",
  })
  profilePicture!: string;

  @prop({ default: false, type: () => String })
  isAdmin!: string;

  @prop({ ref: "Song", type: () => String })
  likedSongs!: Ref<Song>[];

  @prop({ ref: "Album", type: () => String })
  likedAlbums!: Ref<Album>[];

  @prop({ ref: "Artist", type: () => String })
  followedArtists!: Ref<Artist>[];

  @prop({ ref: "Playlist", type: () => String })
  followedPlaylists!: Ref<Playlist>[];
}

export const UserModel = getModelForClass(User);
