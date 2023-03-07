import { program } from 'commander';
import { extract, getSanitizeHtmlOptions, setSanitizeHtmlOptions } from '@extractus/article-extractor';
import { crawlOptions, sanitizeAllowedTags } from './crawl.js';


const main = async () => {
  program
    .command('crawl')
    .description('Crawl a website and index its content')
    .option('-u, --url <url>', 'The url to crawl')
    .action(async (options) => {
      let sanitizeOptions = getSanitizeHtmlOptions()
      sanitizeOptions.allowedTags = sanitizeAllowedTags
      setSanitizeHtmlOptions(sanitizeOptions)
      const article = await extract(options.url, crawlOptions as any);
      console.log(article);
    })

  program.parse()
}

main();