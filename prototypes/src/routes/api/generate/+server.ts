import OpenAI from 'openai';
import { OPENAI_API_KEY, GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateContent } from '$lib/anthropic';

export const GET: RequestHandler = async ({ url }) => {
	const useOllama = url.searchParams.get('useOllama') === 'true';
	const baseURL = useOllama ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1';
	const apiKey = useOllama ? 'ollama' : OPENAI_API_KEY;
	const model = url.searchParams.get('model') ?? 'gpt-3.5-turbo-0125';

	const prompt = url.searchParams.get('prompt');
	if (!prompt) return error(400, 'Missing prompt');

	console.log({ model, baseURL });

	if (model.startsWith('gpt') || useOllama) {
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
		const text = response.choices[0].message.content;
		return json({ text });
	} else if (model.startsWith('gemini')) {
		const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
		const geminiModel = gemini.getGenerativeModel({ model });
		const result = await geminiModel.generateContent(prompt);
		const response = result.response;
		return json({ text: response.text() });
	} else if (model.startsWith('claude')) {
		const response = await generateContent(prompt, model);
		return response;
	} else {
		return error(400, 'Invalid model');
	}
};
