import bcrypt from "bcrypt";
import crypto from "crypto";

// Define the encryption key and IV length
const ENCRYPTION_KEY = crypto.scryptSync(
  process.env.ENCRYPTION_KEY || "your-secret-key-here",
  "salt",
  32
);
const IV_LENGTH = 16;

// Encrypt data function
const encryptData = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// Decrypt data function
const decryptData = (text: string): string => {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// Hash data function using bcrypt
const hashData = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, 10);
};

export { encryptData, decryptData, hashData };
