import { MongoClient } from 'mongodb';
import { MONGO_API_PASS } from '$env/static/private';
import { MONGO_API_USER } from '$env/static/private';

export const MONGO_SERVER = 'cluster0.uakqn3b.mongodb.net'; // liquidx-projects
export const MONGO_CLUSTER = 'Cluster0';

const MONGO_SNOWLINE_SERVER = 'maincluster.ajbtgw2.mongodb.net';
const MONGO_SNOWLINE_CLUSTER = 'MainCluster';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeMongoQueries = async (body: (client: MongoClient) => Promise<any>) => {
	const mongodbUrl = `mongodb+srv://${MONGO_API_USER}:${MONGO_API_PASS}@${MONGO_SERVER}/?retryWrites=true&w=majority&appName=${MONGO_CLUSTER}`;

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
