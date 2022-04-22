import process from 'node:process';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import dateFormat from 'dateformat';
import fsExtra from 'fs-extra';
import fetch from './fetch.js';

const { writeJson, ensureDir } = fsExtra;

async function fetchZhubaiSubscriptions(page, subscriberEmailSet, subscribers) {
  if (!process.env.COOKIE_VALUE) {
    throw new Error('Cookie value is required.');
  }

  page = page || 1;
  const url = `https://zhubai.love/api/dashboard/subscriptions?limit=20&page=${page}`;
  const response = await fetch(url, {
    headers: {
      cookie: process.env.COOKIE_VALUE
    }
  });

  console.log('Fetched page', page);

  if (response.status !== 200) {
    console.warn(response);
    return;
  }

  const data = await response.json();
  //   console.log(data);

  for (const subscriber of data.data) {
    subscribers.push(subscriber);
    if (subscriber.subscriber_email)
      subscriberEmailSet.add(subscriber.subscriber_email);
  }

  const { limit, total_count: total } = data.pagination;
  if (limit * page < total) {
    await fetchZhubaiSubscriptions(page + 1, subscriberEmailSet, subscribers);
  }
}

(async function () {
  const subscriberEmailSet = new Set();
  const subscribers = [];
  try {
    await fetchZhubaiSubscriptions(1, subscriberEmailSet, subscribers);
  } catch (error) {
    console.error(error);
  }

  //   console.log(subscriberEmailSet);
  if (subscribers.length > 0) {
    await ensureDir('data');
    const date = dateFormat(new Date(), 'isoUtcDateTime').replace(/:/g, '-');
    await writeJson('data/subscribers_' + date + '.json', subscribers);
    await writeJson('data/emails_' + date + '.json', [...subscriberEmailSet]);
  }
})();
