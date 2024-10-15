import "dotenv/config"; // Load environment variables from the .env file
import fetch from "node-fetch"; // Node's fetch API for making HTTP requests
import fs from "fs/promises"; // Use the file system to read local files
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Get the API key from environment variables
const apiKey = process.env.MISTRAL_API_KEY || "your_api_key_here";

// Define the model and message
const model = "mistral-large-latest";
const url = "https://api.mistral.ai/v1/chat/completions";

async function getChatResponse() {
  console.log("Starting chat response...");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "Your name is Ursula. You are my girlfriend and companion...Reply with JSON. ",
          },
          { role: "user", content: "What did Christopher Columbus do in Colombia? Please answer in Spanish." },
        ],
        temperature: 0.1,
        response_format: {
          type: "json_object",
        },
      }),
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch chat response:",
        response.status,
        response.statusText
      );
      return;
    }

    const data = await response.json();
    console.log("Chat Response:", data.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching chat response:", error);
  }
}

async function splitDocument() {
  console.log("Starting document split...");
  try {
    const text = await fs.readFile("handbook.txt", "utf8"); // Reads the file content from local file system
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 40,
    });
    const output = await splitter.createDocuments([text]);
    console.log(output);
  } catch (error) {
    console.error("Error splitting document:", error);
  }
}

getChatResponse();
splitDocument();

// Still works to this point