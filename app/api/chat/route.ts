import { StreamingTextResponse } from "ai"
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

    const messages = await req.json();
    // console.log(messages);
    
    const latestMessage = messages.messages[0].content;
    console.log(latestMessage);
    

    let docContext = "";
    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    // console.log(model);
    
    const result = await model.embedContent(latestMessage);
    // console.log(result);
    
    

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: result.embedding.values,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.log("Error querying db...");
      docContext = "";
    }

    const template = {
      role: "system",
      content: `You are ab AI assistant who knows everything about technology and tech startups. Use the below context to augment what you know about technology and tech startups. the context will provide you with the most recent page data from various websites.
        If the context doesn't include the information you need, answer based on your knowledge and don't mention the source of your information or what the context does or doesn't include.
        Format responses using markdown where applicable and don't return images.
        ----------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        ----------------
        QUESTION: ${latestMessage}
        ----------------
        `,
    };

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   stream: true,
    //   messages: [template, ...messages],
    // });

    const response = await model.generateContentStream({
      contents: [template, messages],
    });
    
    const stream = GeminiStream(response);
    return new StreamingTextResponse(stream);

    function GeminiStream(response) {
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response.stream) {
              controller.enqueue(chunk.text());
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    }
  } catch (error) {
    throw error;
  }
}
