
import { PineconeClient, UpsertRequest, Vector } from "@pinecone-database/pinecone";
import { Express } from "express";

import { pineconeKey } from './keys.js';
import { chunksFromUrl } from './webembeddings.js'
import { getEmbeddings } from './openai.js';

const pinecone = new PineconeClient();
await pinecone.init(pineconeKey);

type InsertParams = { text: string, embedding: number[] }
const isValidInsertParam = (param: any): param is InsertParams => {
  return typeof param.text == 'string' && Array.isArray(param.embedding);
}

export const setEmbeddingsEndpoints = (app: Express) => {

  app.get('/embeddings/get', (req, res, next) => {
    let text = req.query.text;
    if (text) {
      getEmbeddings(text as string)
        .then((response) => {
          res.status(200).send(JSON.stringify(response.data));
        }).catch(err => {
          res.status(500).send(err);
        })
    }
  })

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

type ChunkEmbedding = {
  text: string,
  embedding: number[]
}

export const setWebEmbeddingsEndpoints = async (app: Express) => {
  app.post('/embeddings/url', async (req, res, next) => {
    console.log(req.body)
    if (!req.body.url) {
      res.status(400).send('No url provided');
      return
    }

    if (typeof req.body.url != 'string') {
      res.status(400).send('Url must be a string');
      return;
    }

    const url = req.body.url;
    const chunks = await chunksFromUrl(url);
    if (!chunks || chunks.length == 0) {
      res.status(200).send(JSON.stringify({ error: 'No chunks found' }));
      return;
    }

    // Get embeddings for all the chunks.
    const chunkEmbeddings: Promise<ChunkEmbedding>[] = chunks.map(async (chunk: string) => {
      return getEmbeddings(chunk)
        .then((response: any) => ({
          embedding: response.data[0].embedding as number[],
          text: chunk
        }));
    });
    const vectors = await Promise.all(chunkEmbeddings);

    res.status(200)
      .header('Content-Type', 'application/json')
      .send(JSON.stringify(vectors));

    // // Write chunks to the pinecone database.
    // const index = pinecone.Index('knowledge')
    // const upsertRequest: UpsertRequest = {
    //   vectors: vectors,
    //   namespace: 'general'
    // }
    // console.log(upsertRequest);
    // const response = await index.upsert({ upsertRequest });
    // res.status(200).send(JSON.stringify(response));
  })
}