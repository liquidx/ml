import { MongoClient } from 'mongodb';
import { MONGO_DB_PASS } from '$env/static/private';
import { MONGO_DB_USER } from '$env/static/private';

export const MONGO_SERVER = 'db-mongodb-sfo2-liquidx-bdf6d203.mongo.ondigitalocean.com';
export const MONGO_DB_NAME = 'ml';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeMongoQueries = async (body: (client: MongoClient) => Promise<any>) => {
	const mongoDbParams = 'tls=true&authSource=admin&replicaSet=db-mongodb-sfo2-liquidx';
	const mongodbUrl = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@${MONGO_SERVER}/${MONGO_DB_NAME}?${mongoDbParams}`;

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
