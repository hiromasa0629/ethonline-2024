import { PrismaClient, UserType } from "@prisma/client";
import express, { Request } from "express";
import { ReqUserBody } from "../@types/user";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const prisma = new PrismaClient();

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.get("/api/talents", async (_, res) => {
  const users = await prisma.user.findMany({ where: { userType: UserType.TALENT } });
  res.send(users);
});

app.get("/api/talents/:email", async (req: Request<{ email: string }>, res) => {
  console.log(req.params.email);
  const user = await prisma.user.findFirst({ where: { email: req.params.email } });
  res.send(user);
});

app.get("/api/institutions", async (_, res) => {
  const users = await prisma.user.findMany({ where: { userType: UserType.INSTITUTION } });
  res.send(users);
});

app.get("/api/companies", async (_, res) => {
  const users = await prisma.user.findMany({ where: { userType: UserType.COMPANY } });
  res.send(users);
});

app.post("/api/user", async (req: Request<{}, {}, ReqUserBody>, res) => {
  console.log(req.body);
  await prisma.user.create({
    data: {
      email: req.body.email,
      address: req.body.address,
      name: req.body.name,
      userType: req.body.userType,
    },
  });
  res.status(200).send();
});

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
