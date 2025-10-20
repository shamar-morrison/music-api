import {
  prop,
  getModelForClass,
  type Ref,
  modelOptions,
} from "@typegoose/typegoose";
import { Song } from "./song.model.js";
import { Album } from "./album.model.js";
import { Artist } from "./artist.model.js";
import { Playlist } from "./playlist.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: [true, "Name is required"], trim: true })
  name!: string;

  @prop({ required: [true, "Email is required"], unique: true })
  email!: string;

  @prop({
    required: [true, "Password is required"],
    minlength: [6, "Password has to be at least 6 characters long"],
  })
  password!: string;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2023/12/15/21/47/cat-8451431_1280.jpg",
  })
  profilePicture!: string;

  @prop({ default: false })
  isAdmin!: string;

  @prop({ ref: () => Song })
  likedSongs!: Ref<Song>[];

  @prop({ ref: () => Album })
  likedAlbums!: Ref<Album>[];

  @prop({ ref: () => Artist })
  followedArtists!: Ref<Artist>[];

  @prop({ ref: () => Playlist })
  followedPlaylists!: Ref<Playlist>[];
}

export const UserModel = getModelForClass(User);
