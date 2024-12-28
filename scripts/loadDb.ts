import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";


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

const myData: string[] = [
  // "https://www.linkedin.com/in/anshul-wadhwa/",
  // "https://docs.google.com/document/d/1xr74P4L_8DI7RHX4MPm-HQPHjGK5kQJfK4fHld9JJ4g/edit?tab=t.0",
  "https://docs.google.com/document/d/12rVMmKEgxg_aMCYGBzIFeTXyyHuPcxF3gONdiKCQPJg/edit?tab=t.0",
  // "https://github.com/Anshul439",
  // "https://x.com/Anshul_439",
  // "https://drive.google.com/file/d/1EQACuEBgcRl7yMuFFOTa-f5E2PKcRwYR/view",
];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const checkOrCreateCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  try {
    const collections = await db.listCollections();
    const collectionExists = collections.some(
      (col) => col.name === ASTRA_DB_COLLECTION
    );

    if (!collectionExists) {
      const res = await db.createCollection(`${ASTRA_DB_COLLECTION}`, {
        vector: {
          dimension: 768,
          metric: similarityMetric,
        },
      });
      console.log(`Collection created: ${res}`);
    } else {
      console.log("Collection already exists, skipping creation.");
    }
  } catch (error) {
    console.error("Error checking or creating collection:", error);
  }
};


const loadSampleData = async () => {
  const collection = await db.collection(`${ASTRA_DB_COLLECTION}`);
  for await (const url of myData) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const model = genAI.getGenerativeModel({
        model: "text-embedding-004",
      });
      const result = await model.embedContent(chunk);

      const vector = result.embedding.values;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log(res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

checkOrCreateCollection().then(() => loadSampleData());