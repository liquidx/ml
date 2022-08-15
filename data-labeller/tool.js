import e from 'express';
import { promises as fs } from 'fs';

const convertLabelFormat = async () => {
  const labels = JSON.parse(await fs.readFile('./public/labels.json'))
  const newLabels = {}

  labels.forEach(e => {
    const [imageId, label] = e
    newLabels[imageId] = [label]
  });

  fs.writeFile('./public/labels-new.json', JSON.stringify(newLabels))
}

convertLabelFormat()