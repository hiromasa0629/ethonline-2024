//Import libraries
import "dotenv/config";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
// import qrcode from "qrcode-terminal";

let wallet = new Wallet("28216491274bad61a3e7d4c667222b6d9a8747e81e4809f900a8a008d9c1df44");
let xmtp;
//Web3Auth
const WALLET_TO = "0x51ECb56Ef64249B7a956816d102B59c90e996B35";
let conversation;

// Create a client
async function create_a_client() {
  if (!wallet) {
    console.log("Wallet is not initialized");
    return;
  }

  xmtp = await Client.create(wallet, { env: "dev" });
  console.log("Client created", xmtp.address);
}

//Check if an address is on the network
async function check_if_an_address_is_on_the_network() {
  //Message this XMTP message bot to get an immediate automated reply:
  //gm.xmtp.eth (0x937C0d4a6294cdfa575de17382c7076b579DC176) env:production
  if (xmtp) {
    const isOnDevNetwork = await xmtp.canMessage(WALLET_TO);
    console.log(`Can message: ${isOnDevNetwork}`);
  }
}

//Start a new conversation
async function start_a_new_conversation() {
  if (xmtp) {
    conversation = await xmtp.conversations.newConversation(WALLET_TO);
    console.log(`Conversation created with ${conversation.peerAddress}`);
  }
}

//Send a message
async function send_a_message() {
  if (conversation) {
    const message = await conversation.send("gm");
    console.log(`Message sent: "${message.content}"`);
    return message;
  }
}

//Stream messages in a conversation
async function stream_messages_in_a_conversation() {
  if (conversation) {
    console.log(`Streaming messages in conversation with ${conversation.peerAddress}`);
    for await (const message of await conversation.streamMessages()) {
      console.log(`New message from ${message.senderAddress}: ${message.content}`);
      conversation.send("Thanks for subscribing to sunway newsletter.");
    }
  }
}

function printQrCode() {
  qrcode.generate(`https://go.cb-w.com/messaging?address=${wallet?.address}`);
}
// Stream all messages from all conversations
async function stream_all_messages() {
  // printQrCode();
  let current = "";
  if (xmtp) {
    for await (const message of await xmtp.conversations.streamAllMessages()) {
      console.log(`New message from ${message.senderAddress}: ${message.content}`);
      if (message.senderAddress !== xmtp.address) {
        conversation = await xmtp.conversations.newConversation(message.senderAddress);
        await conversation.send("Thank you for subscribing to this news letter!");
        current = message.senderAddress;
      }
    }
  }
}

await create_a_client();
// await check_if_an_address_is_on_the_network();
// await start_a_new_conversation();
// await send_a_message();
// await stream_messages_in_a_conversation();
await stream_all_messages();
