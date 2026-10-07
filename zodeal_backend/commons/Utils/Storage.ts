import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where files will be saved
const uploadDir = path.resolve(__dirname, "..", "..", "uploads");

export const deleteFile = async (filePath: string): Promise<string> => {
  try {
    const fixedFilePath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;
    const fullPath = path.resolve(__dirname, "..", "..", fixedFilePath);

    const fileExists = await fs.promises
      .access(fullPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return `Error: File at path ${fullPath} does not exist.`;
    }

    await fs.promises.unlink(fullPath);
    return `File ${filePath} deleted successfully.`;
  } catch (error) {
    throw error;
  }
};

export const saveFile = async (
  filePath: string,
  file: Express.Multer.File,
  filePrefix = ""
): Promise<string> => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${filePrefix}${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    const destination = path.join(uploadDir, filename);

    await fs.promises.writeFile(destination, file.buffer);
    return filename;
  } catch (error) {
    throw error;
  }
};
