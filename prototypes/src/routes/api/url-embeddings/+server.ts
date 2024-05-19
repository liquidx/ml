import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chunksFromUrl } from '$lib/webembeddings';
import type { ChunkEmbedding } from '$lib/webembeddings';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const targetUrl = new URL(body.url as string);
	if (!targetUrl) return error(400, 'Missing URL');

	const chunks = await chunksFromUrl(targetUrl);

	// Get embeddings for all the chunks.
	const chunkEmbeddings: Promise<ChunkEmbedding>[] = chunks.map(async (chunk: string) => {
		const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
		const model = 'text-embedding-3-large';
		const response = await openai.embeddings.create({
			model,
			input: chunk
		});

		return {
			embedding: response.data[0].embedding as number[],
			text: chunk
		};
	});

	const vectors = await Promise.all(chunkEmbeddings);
	return json(vectors);
};
