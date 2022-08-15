import { promises as fs } from 'fs';
import { join } from 'path';
import * as url from 'url';

import express from 'express';
import cors from 'cors';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express()
const port = 12000

app.use(cors())

app.get('/images', (req, res) => {
  console.log('GET /images')
  res.sendFile(__dirname + '/public/rico.json')
})

app.delete('/images', async (req, res) => {
  const imageId = res.query.imageId
  console.log('DELETE /images', imageId);
  if (imageId) {
    const path = join(__dirname, 'public', 'rico-screenshots', imageId)
    //await fsPromises.rm(path)
    res.status(200).send('ok')
  }
  res.status(403).send('no imageId')
})

// Labelling

let labels = { fileLabels: {} }
fs.readFile(__dirname + '/public/labels.json')
  .then(data => {
    if (data) {
      labels = JSON.parse(data);
      console.log(Object.keys(labels))
    }
  })
  .catch(() => {
    // silent fail
  })

const normalizeLabels = (labels) => {
  if (labels.includes('include') && labels.includes('exclude')) {
    // Take the last one
    let includeIndex = labels.indexOf('include')
    let excludeIndex = labels.indexOf('exclude')
    if (includeIndex > excludeIndex) {
      // Remove exclude
      labels = labels.filter(e => e !== 'exclude')
    } else {
      // Remove include
      labels = labels.filter(e => e !== 'include')
    }
  }

  return labels
}

app.post('/labels', (req, res) => {
  const imageId = req.query.imageId
  const label = req.query.label
  const isToggle = req.query.toggle ? true : false;
  console.log('POST /labels', imageId, label, 'toggle', isToggle);

  // update the labels and save it out.
  if (!labels.fileLabels[imageId]) {
    labels.fileLabels[imageId] = []
  }

  if (isToggle) {
    if (labels.fileLabels[imageId].includes(label)) {
      labels.fileLabels[imageId] = labels.fileLabels[imageId].filter(e => e !== label)
    } else {
      labels.fileLabels[imageId].push(label)
    }
  } else {
    labels.fileLabels[imageId].push(label)
  }

  // Remove any conflicts
  labels.fileLabels[imageId] = normalizeLabels(labels.fileLabels[imageId])

  fs.writeFile(__dirname + '/public/labels.json', JSON.stringify(labels))
  res.send(JSON.stringify(labels))
})

app.get('/labels', (req, res) => {
  console.log('GET /labels');
  res.send(JSON.stringify(labels))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})