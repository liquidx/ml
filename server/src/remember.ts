import { Filter, UpdateFilter, Document } from 'mongodb';
import { Express } from 'express';

import { executeMongoQueries } from './mongodb';
import { getEmbeddings } from './openai';

export const setRememberEndpoints = (app: Express) => {

  app.get('/remember/likes/add', async (req, res, next) => {
    if (!req.query.text) {
      res.status(400).send('No text provided');
      return;
    }
    const text = req.query.text as string;

    const embedding = await getEmbeddings(text);

    if (embedding.data && Array.isArray(embedding.data[0].embedding)) {
      await executeMongoQueries(async (client) => {
        const db = client.db('prototypes');
        const collection = db.collection('rememberme')
        const profile: Record<string, any> = collection.findOne({ _id: '64070855947befad5a5ba078' } as Filter<any>)
        if (!profile['likes']) {
          profile['likes'] = []
        }

        profile['likes'].push({
          text: text,
          embedding: embedding.data[0].embedding
        })
        await collection.updateOne(
          { _id: '64070855947befad5a5ba078' } as Filter<any>,
          { $set: profile } as UpdateFilter<Document>)
        res.status(200).send(JSON.stringify(profile))
      })
    } else {
      res.status(400).send('No embedding found');
      return;
    }
  })

  app.get('/remember/likes/del', async (req, res, next) => {
    if (!req.query.text) {
      res.status(400).send('No text provided');
      return;
    }
    const text = req.query.text as string;
    await executeMongoQueries(async (client) => {
      const db = client.db('prototypes');
      const collection = db.collection('rememberme')
      const profile: Record<string, any> = collection.findOne({ _id: '64070855947befad5a5ba078' } as Filter<any>)
      if (profile['likes']) {
        profile['likes'] = profile['likes'].filter((like: any) => like.text != text)
      }
      await collection.updateOne(
        { _id: '64070855947befad5a5ba078' } as Filter<any>,
        { $set: profile } as UpdateFilter<Document>)
      res.status(200).send(JSON.stringify(profile))
    })
  });

  app.get('/remember/likes/list', async (req, res, next) => {
    await executeMongoQueries(async (client) => {

      const db = client.db('prototypes');
      const collection = db.collection('rememberme')
      const profile: Record<string, any> = collection.findOne({ _id: '64070855947befad5a5ba078' } as Filter<any>)
      res
        .header('Content-Type', 'application/json')
        .status(200)
        .send(JSON.stringify(profile, null, 2))
    })
  })

}