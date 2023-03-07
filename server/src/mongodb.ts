import { MongoClient } from 'mongodb';
import { mongodbKey } from './keys.js';

export const executeMongoQueries = async (body: (client: MongoClient) => Promise<void>) => {
  const mongodbUrl = `mongodb+srv://${mongodbKey.user}:${mongodbKey.password}@clustera.rpvk0fp.mongodb.net/?retryWrites=true&w=majority`
  const client = new MongoClient(mongodbUrl);

  try {
    client.connect();
    console.log('Connected to MongoDB');
    await body(client);
  } finally {
    client.close();
  }
}