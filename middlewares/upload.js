import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;
