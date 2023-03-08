import { Filter, UpdateFilter, Document, ObjectId } from 'mongodb';
import { Express } from 'express';

import { executeMongoQueries } from './mongodb.js';
import { getEmbeddings } from './openai.js';

const staticProfileQuery = { _id: new ObjectId("123456789012345678901234") }

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
        const profile = await collection.findOne(staticProfileQuery as Filter<any>)
        if (!profile) {
          console.error('No profile found')
          res.status(400).send('No profile found');
          return;
        }

        console.log(profile);

        if (!profile['likes']) {
          profile['likes'] = []
        }

        profile['likes'].push({
          text: text,
          embedding: embedding.data[0].embedding
        })

        await collection.updateOne(
          staticProfileQuery as Filter<any>,
          { $set: profile } as UpdateFilter<Document>)
        res
          .header('Content-Type', 'application/json')
          .status(200)
          .send(JSON.stringify(profile))
      })
    } else {
      res.status(400).send('No embedding found');
      return;
    }
  })

  app.get('/remember/likes/del', async (req, res, next) => {
    if (!req.query.text) {
      console.error('No text found')
      res.status(400).send('No text provided');
      return;
    }
    const text = req.query.text as string;
    await executeMongoQueries(async (client) => {
      const db = client.db('prototypes');
      const collection = db.collection('rememberme')
      const profile = await collection.findOne(staticProfileQuery as Filter<any>)
      if (!profile) {
        console.error('No profile found')
        res.status(400).send('No profile found');
        return;
      }
      if (profile['likes']) {
        profile['likes'] = profile['likes'].filter((like: any) => like.text != text)
      }
      await collection.updateOne(
        staticProfileQuery as Filter<any>,
        { $set: profile } as UpdateFilter<Document>)
      res
        .header('Content-Type', 'application/json')
        .status(200)
        .send(JSON.stringify(profile))
    })
  });

  app.get('/remember/likes/list', async (req, res, next) => {
    await executeMongoQueries(async (client) => {

      const db = client.db('prototypes');
      const collection = db.collection('rememberme')
      const profile = await collection.findOne(staticProfileQuery as Filter<any>)
      if (profile) {
        res
          .header('Content-Type', 'application/json')
          .status(200)
          .send(JSON.stringify(profile))
      } else {
        res
          .header('Content-Type', 'application/json')
          .status(200)
          .send('{}')
      }
    })
  })

}