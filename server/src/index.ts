import express from 'express';
import cors from 'cors';

import { setRememberEndpoints } from './remember.js';
import { completion, getModels, chatCompletion } from './openai.js';
import { setEmbeddingsEndpoints, setWebEmbeddingsEndpoints } from './embeddings.js';


const port = Number(process.env.PORT) || 11000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
  res.status(200).send('Hello');
})

app.get('/completion', (req, res, next) => {
  let prompt = req.query.prompt;
  let model = req.query.model || 'text-davinci-003';

  if (!prompt) {
    res.status(400).send('No prompt provided');
    return;
  }


  if (typeof prompt == 'string' && typeof model == 'string') {
    if (model == 'gpt-3.5-turbo' || model == 'gpt-4') {
      chatCompletion(prompt, model)
        .then((text) => {
          res.status(200).send(JSON.stringify({ output: text }));
        }).catch(err => {
          res.status(500).send(err.message);
        })

    } else {
      completion(prompt, model)
        .then((text) => {
          res.status(200).send(JSON.stringify({ output: text }));
        }).catch(err => {
          res.status(500).send(err.message);
        })
    }
  } else {
    res.status(400).send('Prompt and model must be strings');
    return;
  }
})

app.get('/models', async (req, res, next) => {
  const models = await getModels()
  res.status(200).send(models);
})

setWebEmbeddingsEndpoints(app);
setEmbeddingsEndpoints(app);
setRememberEndpoints(app);


export const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
