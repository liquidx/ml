
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


export const predict = async (prompt: string, model: string) => {
  const response = await openai.createCompletion({
    model: model,
    prompt: prompt,
    temperature: 0.1,
    max_tokens: 100
  });
  return response.data.choices[0].text;
};