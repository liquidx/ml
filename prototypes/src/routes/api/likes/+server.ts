import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeMongoQueries } from '$lib/mongodb';
import type { MongoClient, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';

const staticProfileQuery = { _id: new ObjectId('123456789012345678901234') };

export const PUT: RequestHandler = async ({ request }) => {
	const params = await request.json();

	return executeMongoQueries(async (client: MongoClient) => {
		const db = client.db('prototypes');
		const collection = db.collection('rememberme');
		const profile = await collection.findOne(staticProfileQuery);
		if (!profile) {
			return error(400, 'No profile found');
		}

		if (!profile['likes']) {
			profile['likes'] = [];
		}

		profile['likes'].push({
			text: params.text,
			embedding: params.embedding
		});

		await collection.updateOne(staticProfileQuery, { $set: profile });

		return json(profile);
	});
};

export const GET: RequestHandler = async () => {
	return executeMongoQueries(async (client) => {
		const db = client.db('prototypes');
		const collection = db.collection('rememberme');
		const profile = await collection.findOne(staticProfileQuery);
		if (profile) {
			return json(profile);
		} else {
			return error(400, 'No profile found');
		}
	});
};

export const DELETE: RequestHandler = async ({ url }) => {
	const text = url.searchParams.get('text');
	if (!text) {
		return error(400, 'No text provided');
	}

	return executeMongoQueries(async (client) => {
		const db = client.db('prototypes');
		const collection = db.collection('rememberme');
		const profile = await collection.findOne(staticProfileQuery);
		if (!profile) {
			return error(400, 'No profile found');
		}

		if (profile['likes']) {
			profile['likes'] = profile['likes'].filter((like: any) => like.text != text);
		}
		await collection.updateOne(staticProfileQuery, { $set: profile });
		return json({ success: true, profile });
	});
};
