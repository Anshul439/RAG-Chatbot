import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const {
  GEMINI_API_KEY,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(`${ASTRA_DB_API_ENDPOINT}`, {
  namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log(messages);

    // Check if messages is defined and has at least one element
    const latestMessage =
      messages && messages.length > 0
        ? messages[messages.length - 1].content
        : "";

    console.log(latestMessage);

    let docContext = "";
    const model1 = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const model2 = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    // console.log(model);

    const result = await model1.embedContent(latestMessage);
    // console.log(result);

    try {
      const collection = await db.collection(`${ASTRA_DB_COLLECTION}`);
      const cursor = collection.find({}, {
        sort: {
          $vector: result.embedding.values,
        },
        limit: 10,
      });
      

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.log("Error querying db...", error);
      docContext = "";
    }

    const prompt = `You are an AI assistant with detailed knowledge of Anshul Wadhwa. Use the following context to enhance your responses about Anshul Wadhwa. The context will include the most recent data gathered from various sources.  
If the context does not contain the required information, respond based on your prior knowledge without referencing the source of the information.  
Format all responses using markdown where appropriate and avoid returning images.  
----------------  
START CONTEXT  
${docContext}  
END CONTEXT  
----------------  
QUESTION: ${latestMessage}  
----------------
    `;

    const result2 = await model2.generateContent(prompt);
    console.log(result2.response.text());

    // Return as ReadableStream in response
    return new Response(
      JSON.stringify({
        content: result2.response.text(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );

    // function GeminiStream(response) {
    //   return new ReadableStream({
    //     async start(controller) {
    //       try {
    //         for await (const chunk of response.stream) {
    //           controller.enqueue(chunk.text());
    //         }
    //         controller.close();
    //       } catch (error) {
    //         controller.error(error);
    //       }
    //     },
    //   });
    // }
  } catch (error) {
    throw error;
  }
}
