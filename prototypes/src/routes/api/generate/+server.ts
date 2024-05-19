import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const useOllama = url.searchParams.get('useOllama') === 'true';
	const baseURL = useOllama ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1';
	const apiKey = useOllama ? 'ollama' : OPENAI_API_KEY;
	const model = url.searchParams.get('model') ?? 'gpt-3.5-turbo-0125';

	const prompt = url.searchParams.get('prompt');
	if (!prompt) return error(400, 'Missing prompt');

	console.log({ model, baseURL });

	const openai = new OpenAI({ apiKey, baseURL });
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
