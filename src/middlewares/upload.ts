import multer from "multer";
import path from "path";

export const storageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "/uploads");
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

export const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, state: boolean) => void,
) => {
  if (
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/wav" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "unsupported file format. only images and video files are allowed.",
    ),
    false,
  );
};

export const initUpload = multer({
  storage: storageConfig,
});
