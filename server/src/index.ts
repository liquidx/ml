import express from 'express';
import cors from 'cors';

import { openaiKey } from './keys.js';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: openaiKey
});
const openai = new OpenAIApi(configuration);

const predict = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
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

  if (prompt && typeof prompt == 'string') {
    predict(prompt)
      .then((text) => {
        res.status(200).send(JSON.stringify({ output: text }));
      }).catch(err => {
        res.status(500).send(err);
      })
  } else {
    res.status(400).send('No prompt provided');
  }
})


export const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
