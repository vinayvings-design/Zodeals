import { readFile } from "fs/promises";
import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount: ServiceAccount = JSON.parse(
  await readFile(
    new URL(
      "../../hireinfluencer-4e187-firebase-adminsdk-fbsvc-3bf9e2957f.json",
      import.meta.url
    )
  ).then((data) => data.toString())
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
