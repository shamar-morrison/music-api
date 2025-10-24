import type { User } from "../models/user.model.js";

/**
 * Type for updating user properties - excludes methods from the User class
 */
export type UpdateUserData = Partial<
  Omit<User, "comparePassword" | "generateToken">
>;

/**
 * Type for creating a new user - excludes methods and makes certain fields required
 */
export type CreateUserData = Pick<User, "name" | "email" | "password"> &
  Partial<Pick<User, "isAdmin" | "profilePicture">>;

/**
 * Type for user login data
 */
export type LoginUserData = Pick<User, "email" | "password">;
