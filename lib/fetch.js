import nodefetch from 'node-fetch';

const defaultUserAgent =
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36";
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29';

export default function fetch(url, args = {}) {
  args.headers = args.headers || {};
  args.headers['user-agent'] = args.headers['user-agent'] || defaultUserAgent;
  return nodefetch(url, args);
}
