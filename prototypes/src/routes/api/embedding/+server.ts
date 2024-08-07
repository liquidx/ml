import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const input = url.searchParams.get('input');
	if (!input) return error(400, 'Missing input');

	const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
	const model = 'text-embedding-3-large';
	const response = await openai.embeddings.create({
		model,
		input
	});

	return json(response);
};
