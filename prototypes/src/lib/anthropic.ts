import { ANTHROPIC_API_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import axios from 'axios';

export const generateContent = async (prompt: string, model: string): Response => {
	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': ANTHROPIC_API_KEY
	};

	const url = `https://api.anthropic.com/v1/messages`;
	const data = {
		model,
		messages: [{ role: 'user', content: prompt }]
	};
	const response = await axios.post(url, data, { headers });
	if (!response || !response.data) {
		return error(500, 'No response from Anthropic API');
	}
	const firstContent = response.data.content[0];
	if (!firstContent || !firstContent.text) {
		return error(500, 'No content in response from Anthropic API');
	}

	return json({ text: firstContent.text });
};
