import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";
import { Song } from "./song.model.js";

class User {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true, minlength: 6 })
  password!: string;

  @prop({
    default:
      "https://cdn.pixabay.com/photo/2023/12/15/21/47/cat-8451431_1280.jpg",
  })
  profilePicture!: string;

  @prop({ default: false })
  isAdmin!: string;

  @prop({ ref: () => Song, type: () => String })
  likedSongs!: Ref<Song>[];
}

export const UserModel = getModelForClass(User);
