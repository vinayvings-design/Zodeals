import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

const generateAuthToken = (username: string): string => {
  try {
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign({ userId: username }, secret);
  } catch (error) {
    throw error;
  }
};

export default generateAuthToken;
