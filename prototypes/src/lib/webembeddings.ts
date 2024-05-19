import {
	extract,
	getSanitizeHtmlOptions,
	setSanitizeHtmlOptions
} from '@extractus/article-extractor';

import { crawlOptions, sanitizeAllowedTags } from './crawl.js';
import { chunkHtml } from './html.js';

export type ChunkEmbedding = {
	text: string;
	embedding: number[];
};

export const chunksFromUrl = async (url: URL): Promise<string[]> => {
	const sanitizeOptions = getSanitizeHtmlOptions();
	sanitizeOptions.allowedTags = sanitizeAllowedTags;
	setSanitizeHtmlOptions(sanitizeOptions);
	const article = await extract(url.toString(), crawlOptions as any);
	if (!article) {
		return [];
	}

	if (!article.content || typeof article.content != 'string') {
		return [];
	}

	return chunkHtml(article.content as string, 2000);
};
