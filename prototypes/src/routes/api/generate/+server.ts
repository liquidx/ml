import OpenAI from 'openai';
import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const prompt = url.searchParams.get('prompt');
	if (!prompt) return error(400, 'Missing prompt');

	const openai = new OpenAI({ apiKey: PUBLIC_OPENAI_API_KEY });
	const model = 'gpt-3.5-turbo-0125';
	const response = await openai.chat.completions.create({
		model,
		messages: [
			{
				role: 'system',
				content: prompt
			}
		]
	});

	return json(response);
};
