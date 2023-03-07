export const crawlOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  },
}

export const sanitizeAllowedTags =
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
    'p', 'ul', 'ol', 'nl', 'li', 'b', 'i',
    'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table',
    'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span', 'font',
    'u', 'sup', 'sub', 's', 'del', 'ins', 'small', 'big', 'center',
    'tt', 'summary', 'details', 'summary', 'details', 'summary', 'deta'];
