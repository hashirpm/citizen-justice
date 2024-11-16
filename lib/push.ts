// use push protocol to call the integration service
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

// import ether
import { ethers } from "ethers";

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const GEMINI_API_KEY = "AIzaSyCmHmyTnhofdOwI6vnoiS8wXyBWBez4mQU";
const PRIVATE_KEY =
  "584799f49952962b0022fff8ada7e36d319b0578b6809f2ffcf540b227673cf5";
if (!GEMINI_API_KEY || !PRIVATE_KEY) {
  throw new Error(
    "Required environment variables GEMINI_API_KEY or PRIVATE_KEY are missing."
  );
}

// Create a new instance of GoogleGenerativeAI with the current API key
function createGenAIInstance(): GoogleGenerativeAI {
  const GEMINI_API_KEY = "AIzaSyCmHmyTnhofdOwI6vnoiS8wXyBWBez4mQU";

  if (!GEMINI_API_KEY) {
    throw new Error("Environment variable GEMINI_API_KEY is required.");
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// new event is submitted notifications
async function createContentOnCreateEvent(
  eventDescription: string
): Promise<string | undefined> {
  try {
    const genAI = createGenAIInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      eventDescription +
      "\n create an notification message on this Dispute event where people submit evidence according to the possibilities, in here we need split the content as title and description and title should be less than 120 charcters and conetnet should be lessthan 400 charcters where The title should be prefixed with title: and the description should be prefixed with description: ";
    const result = await model.generateContent(prompt);
    console.log(result.response?.text());

    return result.response.text();
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 60000));
    createContentOnCreateEvent(eventDescription);
  }
}

const parseNotification = (inputString: string) => {
  const titleMatch = inputString.match(/title:\s*(.*)/i);
  const descriptionMatch = inputString.match(/description:\s*(.*)/i);

  const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "").trim() : null;
  const description = descriptionMatch
    ? descriptionMatch[1].replace(/\*\*/g, "").trim()
    : null;

  return { title, description };
};

// // Function to test summarization
// export async function createNotificationContent(
//   content: string
// ): Promise<void> {
//   try {
//     const genAI = createGenAIInstance();
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = content;
//     const result = await model.generateContent(prompt);
//     console.log(result.response?.text());
//   } catch (error) {
//     await new Promise((resolve) => setTimeout(resolve, 60000));
//     createNotificationContent(content);
//   }
// }

// createNotificationContent("what is the capital of india");

// initialise provider
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/b64a898d00864f2e9136df8af75dd7fc"
);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// create an function send an sample notifications
export async function sendEventCreatedNotification(eventDescription: string) {
  var input = await createContentOnCreateEvent(eventDescription);

  const { title, description } = parseNotification(input ?? "");
  // initialise push api
  const userAliace = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });

  if (title || description) {
    const apiResponse = await userAliace.channel.send(["*"], {
      notification: {
        title: title ?? "New Event is created",
        body: description ?? "Event Description",
      },
    });
    console.log(apiResponse);
  } else {
    console.log(title);
    console.log(description);
  }

  // log the response
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
