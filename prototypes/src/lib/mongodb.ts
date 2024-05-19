import { MongoClient } from 'mongodb';
import { MONGO_API_PASS } from '$env/static/private';
import { MONGO_API_USER } from '$env/static/private';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeMongoQueries = async (body: (client: MongoClient) => Promise<any>) => {
	const mongodbUrl = `mongodb+srv://${MONGO_API_USER}:${MONGO_API_PASS}@maincluster.ajbtgw2.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster`;

	let client: MongoClient | undefined;
	try {
		client = new MongoClient(mongodbUrl);
		client.connect();
		console.log('Connected to MongoDB');
		return await body(client);
	} finally {
		if (client) {
			client.close();
		}
	}
};
