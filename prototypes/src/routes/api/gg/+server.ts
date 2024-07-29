import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json();

	const model = body.model;
	const prompt = body.prompt;
	if (!prompt) return error(400, 'Missing prompt');

	const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
	const geminiModel = gemini.getGenerativeModel({ model });
	const result = await geminiModel.generateContent(prompt);
	return json(result.response);
};
