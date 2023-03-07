import { extract, getSanitizeHtmlOptions, setSanitizeHtmlOptions } from '@extractus/article-extractor'

import { crawlOptions, sanitizeAllowedTags } from './crawl.js';
import { chunkHtml } from './html.js';


export const chunksFromUrl = async (url: string): Promise<string[]> => {
  let sanitizeOptions = getSanitizeHtmlOptions()
  sanitizeOptions.allowedTags = sanitizeAllowedTags
  setSanitizeHtmlOptions(sanitizeOptions)
  const article = await extract(url as string, crawlOptions as any);
  if (!article.content || typeof article.content != 'string') {
    return [];
  }

  return chunkHtml(article.content as string, 2000);
}