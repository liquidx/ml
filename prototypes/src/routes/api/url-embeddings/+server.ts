import OpenAI from 'openai';
import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chunksFromUrl } from '$lib/webembeddings';
import type { ChunkEmbedding } from '$lib/webembeddings';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) return error(400, 'Missing URL');

	const chunks = await chunksFromUrl(targetUrl);

	// Get embeddings for all the chunks.
	const chunkEmbeddings: Promise<ChunkEmbedding>[] = chunks.map(async (chunk: string) => {
		const openai = new OpenAI({ apiKey: PUBLIC_OPENAI_API_KEY });
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
