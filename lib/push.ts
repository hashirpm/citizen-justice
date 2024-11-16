// use push protocol to call the integration service
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

// import ether
import { ethers } from "ethers";

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!GEMINI_API_KEY || !PRIVATE_KEY) {
  throw new Error(
    "Required environment variables GEMINI_API_KEY or PRIVATE_KEY are missing."
  );
}

// Create a new instance of GoogleGenerativeAI with the current API key
function createGenAIInstance(): GoogleGenerativeAI {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("Environment variable GEMINI_API_KEY is required.");
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Function to test summarization
export async function createNotificationContent(
  content: string
): Promise<void> {
  try {
    const genAI = createGenAIInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = content;
    const result = await model.generateContent(prompt);
    console.log(result.response?.text());
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 60000));
    createNotificationContent(content);
  }
}
createNotificationContent("what is the capital of india");

// initialise provider
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/b64a898d00864f2e9136df8af75dd7fc"
);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// create an function send an sample notifications
async function sendNotification() {
  // initialise push api
  const userAliace = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });
  const apiResponse = await userAliace.channel.send(["*"], {
    notification: {
      title: "Hello",
      body: "Hello from Push Protocol",
    },
  });

  // log the response
  console.log(apiResponse);
}

// // call the function
// // sendNotification();

// // get notifications from the push protocol
// async function getNotifications() {
//   // initialise push api
//   const userAliace = await PushAPI.initialize(signer, {
//     env: CONSTANTS.ENV.STAGING,
//   });
//   const apiResponse = await userAliace.notification.list("INBOX");
//   console.log(apiResponse);

//   console.log("Notification count: ", apiResponse.data.length);
// }

// getNotifications();
