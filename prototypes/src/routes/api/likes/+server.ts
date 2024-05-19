import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeMongoQueries } from '$lib/mongodb';
import type { MongoClient, Filter, UpdateFilter } from 'mongodb';
import { ObjectId } from 'mongodb';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import type { Like } from '$lib/likes';
import { kind } from 'openai/_shims/index.mjs';

const MONGO_DATABASE_NAME = 'ml';
const MONGO_COLLECTION_NAME = 'rememberme';
const DEFAULT_USER = '0';

export const PUT: RequestHandler = async ({ request }) => {
	const params = await request.json();
	const text = params.text;

	if (!text) {
		return error(400, 'No text provided');
	}

	// Get embedding
	const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
	const model = 'text-embedding-3-large';
	const response = await openai.embeddings.create({
		model,
		input: text
	});
	const embedding = response.data[0].embedding as number[];

	if (!embedding) {
		return error(400, 'No embedding generated');
	}

	return executeMongoQueries(async (client: MongoClient) => {
		const db = client.db(MONGO_DATABASE_NAME);
		const collection = db.collection(MONGO_COLLECTION_NAME);

		const like: Like = {
			_id: new ObjectId(),
			userId: DEFAULT_USER,
			text: text,
			embedding: embedding
		};
		const result = await collection.insertOne(like);
		if (!result.acknowledged) {
			return error(500, 'Failed to insert like');
		}

		return json(like);
	});
};

export const GET: RequestHandler = async () => {
	return executeMongoQueries(async (client) => {
		const db = client.db(MONGO_DATABASE_NAME);
		const collection = db.collection(MONGO_COLLECTION_NAME);
		const likes = await collection.find({ userId: DEFAULT_USER }).toArray();
		if (likes && likes.length > 0) {
			return json({ likes });
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
		const db = client.db(MONGO_DATABASE_NAME);
		const collection = db.collection(MONGO_COLLECTION_NAME);
		const result = await collection.deleteOne({ userId: DEFAULT_USER, text: text });
		if (result.deletedCount > 0) {
			return json({ success: true });
		}

		return error(400, 'No like found');
	});
};
