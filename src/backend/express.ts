import express, { Request } from "express";
import { ReqUserBody } from "../@types/user";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    console.log("Reloading Backend...");
    server.close();
  });

  import.meta.hot.dispose(() => {
    console.log("Disposing Backend...");
    server.close();
  });
}
