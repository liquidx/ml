import { MongoClient } from 'mongodb';
import { MONGO_API_PASS } from '$env/static/private';
import { MONGO_API_USER } from '$env/static/private';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeMongoQueries = async (body: (client: MongoClient) => Promise<any>) => {
	const mongodbUrl = `mongodb+srv://${MONGO_API_USER}:${MONGO_API_PASS}@clustera.rpvk0fp.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(mongodbUrl);

	try {
		client.connect();
		console.log('Connected to MongoDB');
		return await body(client);
	} finally {
		client.close();
	}
};
