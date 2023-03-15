
import { Configuration, OpenAIApi } from 'openai';
import { openaiKey } from './keys.js';


const configuration = new Configuration({
  apiKey: openaiKey
});
const openai = new OpenAIApi(configuration);

export const getEmbeddings = async (text: string): Promise<any> => {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text
  })
  return response.data
}


export const completion = async (prompt: string, model: string) => {
  const response = await openai.createCompletion({
    model: model,
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000
  });
  return response.data.choices[0].text;
};

export const chatCompletion = async (prompt: string, model: string) => {
  const response = await openai.createChatCompletion({
    model: model,
    messages: [
      { role: 'user', content: prompt }
    ]
  })
  if (!response.data || !response.data.choices) {
    return '';
  }

  if (response.data.choices.length == 0) {
    return '';
  }

  let firstChoice = response.data.choices[0];
  if (!firstChoice.message || !firstChoice.message.content) {
    return '';
  }
  return firstChoice.message.content;
}

export const getModels = async () => {
  const response = await openai.listModels();
  return response.data;
}