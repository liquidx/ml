
import { PineconeClient, UpsertRequest, Vector } from "@pinecone-database/pinecone";
import { Express } from "express";

import { pineconeKey } from './keys.js';
import { chunksFromUrl } from './webembeddings'
import { getEmbeddings } from './openai.js';

const pinecone = new PineconeClient();
await pinecone.init(pineconeKey);



type InsertParams = { text: string, embedding: number[] }
const isValidInsertParam = (param: any): param is InsertParams => {
  return typeof param.text == 'string' && Array.isArray(param.embedding);
}

export const setEmbeddingsEndpoints = (app: Express) => {

  app.post('/embeddings/insert', async (req, res, next) => {
    if (!req.query.contents) {
      res.status(400).send('No contents provided');
      return
    }

    if (isValidInsertParam(req.query.contents)) {
      let contents: InsertParams = req.query.contents;
      const index = pinecone.Index('knowledge')
      const upsertRequest: UpsertRequest = {
        vectors: [
          {
            id: contents.text,
            values: contents.embedding,
          }
        ],
        namespace: 'general'
      }
      const response = await index.upsert({ upsertRequest });
      res.status(200).send(JSON.stringify(response));
    }
  })
};

export const setWebEmbeddingsEndpoints = async (app: Express) => {
  app.post('/embeddings/insert-url', async (req, res, next) => {
    if (!req.query.url) {
      res.status(400).send('No url provided');
      return
    }

    if (typeof req.query.url != 'string') {
      res.status(400).send('Url must be a string');
      return;
    }

    const url = req.query.url;
    const chunks = await chunksFromUrl(url);
    if (!chunks || chunks.length == 0) {
      res.status(400).send('No chunks found');
      return;
    }

    // Get embeddings for all the chunks.
    const chunkEmbeddings: Promise<Vector>[] = chunks.map(async (chunk: string) => {
      return getEmbeddings(chunk)
        .then((response: any) => ({
          values: response.data[0].embedding as number[],
          id: chunk
        }));
    });
    const vectors = await Promise.all(chunkEmbeddings);

    // Write chunks to the pinecone database.
    const index = pinecone.Index('knowledge')
    const upsertRequest: UpsertRequest = {
      vectors: vectors,
      namespace: 'general'
    }
    console.log(upsertRequest);
    const response = await index.upsert({ upsertRequest });
    res.status(200).send(JSON.stringify(response));
  })
}