import express from 'express';
import cors from 'cors';

import { openaiKey } from './keys.js';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: openaiKey
});
const openai = new OpenAIApi(configuration);

const predict = async (prompt: string, model: string) => {
  const response = await openai.createCompletion({
    model: model,
    prompt: prompt,
    temperature: 0.1,
    max_tokens: 100
  });
  return response.data.choices[0].text;
};

//
//
//


const port = Number(process.env.PORT) || 11000;

const app = express();
app.use(cors());

app.get('/', (req, res, next) => {
  res.status(200).send('Hello');
})

app.get('/predict', (req, res, next) => {
  let prompt = req.query.prompt;
  let model = req.query.model || 'text-davinci-003';

  if (!prompt) {
    res.status(400).send('No prompt provided');
    return;
  }

  if (typeof prompt == 'string' && typeof model == 'string') {
    predict(prompt, model)
      .then((text) => {
        res.status(200).send(JSON.stringify({ output: text }));
      }).catch(err => {
        res.status(500).send(err);
      })
  } else {
    res.status(400).send('Prompt and model must be strings');
    return;
  }
})


export const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
