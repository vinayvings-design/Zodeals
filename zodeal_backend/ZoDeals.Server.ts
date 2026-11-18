import express from "express";
import { fileURLToPath } from "url";
import { connectDB } from "./src/DB/Mongoose.Connection.Db.js";
import router from "./src/Routes/ZoDeals.Routes.js";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import setupSwagger from "./src/Swagger/Swagger.js";
import { UserModel } from "./src/Models/User/User.Model.js";
import { deleteAllusersQuery } from "./src/Queries/User.Query.js";
import { rateLimit } from "./src/Middleware/RateLimit.js";
import { clearCacheOnWrite } from "./src/Middleware/Cache.js";
import { PinCodeModel } from "./src/Models/Pincode/Pincode.Model.js";
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const app = express();
// Railway sits behind a proxy: trust it so rate limiting sees each visitor's real IP.
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const uploadsBaseDir = path.join(process.cwd(), "uploads");
console.log("Serving static files from:", uploadsBaseDir);

app.use("/uploads", express.static(uploadsBaseDir, { maxAge: "7d" }));
// Throttle API traffic per IP (uploads and the health page are excluded), stricter for sign-in.
app.use(["/login", "/forgot/password"], rateLimit(20));
app.use(rateLimit(600));
app.use(clearCacheOnWrite);
app.get("/", async (req, res) => {
  res.send("Hi, This is zo deals.");
});
setupSwagger(app);
// const deleteAll = async () => {
//   try {
//     await deleteAllusersQuery();
//   } catch (error) {
//     throw error;
//   }
// };
// deleteAll();
app.use("/", router);
const PORT = process.env.PORT || 6006;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
// await UserModel.updateMany(
//   { phoneNumber: { $exists: false } },
//   { $set: { phoneNumber: "0" } }
// );
