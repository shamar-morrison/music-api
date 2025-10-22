import { cloudinary } from "config/cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    // delete local file after upload
    fs.unlinkSync(filePath);
    return result;
  } catch (error: any) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Failed to upload to cloudinary");
  }
};
