export const chunkHtml = (html: string, chunkSize: number): string[] => {
  // First split using <p> tags.
  const paragraphs = html.split('</p>').map(chunk => chunk.replace('<p>', ''))
  // Then split each chunk into chunks of chunkSize.
  let chunks: string[] = [];
  paragraphs.forEach(p => {
    if (p.length > chunkSize) {
      let chunk = p.slice(0, chunkSize);
      chunks.push(chunk);
      let remaining = p.slice(chunkSize);
      while (remaining.length > chunkSize) {
        chunk = remaining.slice(0, chunkSize);
        chunks.push(chunk);
        remaining = remaining.slice(chunkSize);
      }
      chunks.push(remaining);
    } else {
      chunks.push(p);
    }
  })
  return chunks;
}