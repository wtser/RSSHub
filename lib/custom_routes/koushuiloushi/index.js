const got = require('@/utils/got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const baseLink = 'https://zzhzbbs.zjol.com.cn';

module.exports = async (ctx) => {
    const response = await ctx.cache.tryGet(
        `${baseLink}/forum-2-1.html`,
        async () =>
            (await got.get(`${baseLink}/forum-2-1.html`, {
                responseType: 'buffer',
            })).data
    );

    const decodeHtml = iconv.decode(response, 'gbk');

    const $ = cheerio.load(decodeHtml, { decodeEntities: false });
    const title = $('title').text();
    const list = $('[id^=normalthread]');

    const items = list.map((index, item) => {
        item = $(item);
        const title = item.find('a.s.xst').text();
        const link = `${baseLink}/${item.find('a.s.xst').attr('href')}`;
        const guid = link;
        const description = ``;

        const single = {
            title,
            description,
            link,
            guid,
        };

        return single;
    });

    ctx.state.data = {
        title,
        link: baseLink,
        item: items.get(),
    };
};
