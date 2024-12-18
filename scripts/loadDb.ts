import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  GEMINI_API_KEY,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);

const techData = [
  // "https://techcrunch.com/",
  // "https://news.crunchbase.com/",
  // "https://venturebeat.com/",
  // "https://indianexpress.com/section/technology/",
  // "https://www.ycombinator.com/blog/tag/yc-news",
  // "https://builtin.com/tech-topics",
  // "https://www.cbinsights.com/research/",
  // "https://arstechnica.com/",
  // "https://growthlist.co/funded-startups/",
  // "https://topstartups.io/",
  // "https://news.crunchbase.com/unicorn-company-list/",
  // "https://topstartups.io/?hq_location=India",
  // "https://wellfound.com/startups/location/india"
  // "https://www.linkedin.com/in/anshul-wadhwa/",
  "https://chatgpt.com/share/6760175a-a730-800e-81d5-60d880e94a4f",
  "https://docs.google.com/document/d/1xr74P4L_8DI7RHX4MPm-HQPHjGK5kQJfK4fHld9JJ4g/edit?tab=t.0",
  "https://github.com/Anshul439",
  "https://x.com/Anshul_439",
  "https://drive.google.com/file/d/1EQACuEBgcRl7yMuFFOTa-f5E2PKcRwYR/view"
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(`${ASTRA_DB_API_ENDPOINT}`, {
  namespace: ASTRA_DB_NAMESPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(`${ASTRA_DB_COLLECTION}`, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const collection = await db.collection(`${ASTRA_DB_COLLECTION}`);
  for await (const url of techData) {
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

createCollection().then(() => loadSampleData());
