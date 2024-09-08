import express, { Request } from "express";
import { ReqUserBody } from "../@types/user";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const PRIVATE_KEY_PAIR: Record<any, any> = {
  "0x7fd8eae6d31628e947816a31dED60Da39b068FFE": process.env.WEB3_SUNWAY_PRIVATE_KEY, // JAMES LIM WEB3AUTH
  "0x51ECb56Ef64249B7a956816d102B59c90e996B35": process.env.WEB3_MONASH_PRIVATE_KEY, // FAS TING WEB3AUTH
  "0xCddB21BC982A58E808b6e594de90aEE71f4D7152": process.env.TAYLORS_PRIVATE_KEY, // Not from WEB3AUTH
};

const PAIRING: Record<any, any> = {
  "0x7fd8eae6d31628e947816a31dED60Da39b068FFE": "SUNWAY", // JAMES LIM WEB3AUTH
  "0x51ECb56Ef64249B7a956816d102B59c90e996B35": "MONASH", // FAS TING WEB3AUTH
  "0xCddB21BC982A58E808b6e594de90aEE71f4D7152": "TAYLORS", // Not from WEB3AUTH
};

app.post("/api/subscribe-to-broadcast", async (req: Request<{}, {}, ReqUserBody>, res) => {
  const { senderAddress, receiverAddress, message } = req.body as any;
  if (!PRIVATE_KEY_PAIR[receiverAddress]) return;

  let wallet = new Wallet(PRIVATE_KEY_PAIR[receiverAddress]);
  let xmtp = await Client.create(wallet, { env: "dev" });
  let isOnNetwork;
  let conversation;
  if (xmtp) {
    isOnNetwork = await xmtp.canMessage(senderAddress);
    console.log(`Can message: ${isOnNetwork}`);
  }
  if (isOnNetwork) {
    conversation = await xmtp.conversations.newConversation(senderAddress);
    console.log(`Conversation created with ${conversation.peerAddress}`);
  }
  if (conversation) {
    if (senderAddress !== xmtp.address) {
      if (message === "I would like to subscribe to this news letter!") {
        await conversation.send(
          `Thank you for subscribing to the ${PAIRING[receiverAddress]} newsletter! We're excited to keep you updated with our latest news and insights. Stay tuned!`
        );
      } else {
        await conversation.send(
          "Thank you for reaching out to us. We have received your message and will respond as soon as possible. Your patience is greatly appreciated."
        );
      }
    }
  }

  console.log(req.body);
  console.log("============");
  console.log(senderAddress, receiverAddress);
  res.send("ok");
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
