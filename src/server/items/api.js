// @flow

import Boom from 'boom';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { route } from '../core';

const nestedRoute = route.nested('/api');

const getItems = async () => {
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
  const url = 'https://distrowatch.com/packages.php';

  const body = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
    },
  }).then(b => b.text());

  const $ = cheerio.load(body);
  const ret = [];
  $('.Auto tr').each((i1, tr) => {
    if (i1 === 0) return;
    const nameNode = $('th', tr);
    const name = {
      link: $('a', nameNode).attr('href'),
      text: nameNode.text(),
    };
    const versionNode = $('td', tr);
    let version;
    versionNode.each((i2, td) => {
      if (i2 === 0) {
        version = {
          link: $('a', td).attr('href'),
          text: $('a', td).text(),
        };
      }
    });
    ret.push({
      id: i1,
      name,
      version,
      note: $('.Note1', tr).text(),
    });
  });
  return ret;
};

nestedRoute.get('/items', async (request, reply) => {
  const items = await getItems();
  if (items) {
    reply(items);
  } else {
    reply(Boom.serverUnavailable('Widget load fails 33% of the time. You were unlucky.', {}));
  }
}, {
  tags: ['api'],
});
