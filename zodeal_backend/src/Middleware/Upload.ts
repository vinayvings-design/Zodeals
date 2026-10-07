import path from "path";
import fs from "fs";
import multer, { StorageEngine } from "multer";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    fileFilenames?: string[];
  }
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const createStorage = (folderName: string): StorageEngine => {
  const projectRoot = process.cwd();
  return multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const destination = path.join(
       projectRoot,
        "uploads",
        folderName
      );

      fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) {
          console.error("Directory creation failed:", err);
          return cb(err, destination);
        }
        cb(null, destination);
      });
    },
    filename: (req: Request, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      const filename = uniqueSuffix + fileExtension;

      if (!req.fileFilenames) {
        req.fileFilenames = [];
      }
      req.fileFilenames.push(filename);
      cb(null, filename);
    },
  });
};

const dynamicUpload = (
  fieldName: string,
  folderName: string,
  isMultiple: boolean = false
) => {
  const storage = createStorage(folderName);
  const upload = multer({
    limits: { fileSize: 1024 * 1024 * 10 },
    storage: storage,
  });

  return isMultiple ? upload.array(fieldName) : upload.single(fieldName);
};

export { dynamicUpload, createStorage };
