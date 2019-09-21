const got = require('@/utils/got');
const cheerio = require('cheerio');
const baseLink = 'http://www.yuhang.gov.cn';

module.exports = async (ctx) => {
    const { col } = ctx.params;
    const response = await got.get(`http://www.yuhang.gov.cn/col/col${col}/index.html`);
    const $ = cheerio.load(response.data);
    const title = $('title').text();
    const xmlContent = $('.text-list-1 script').html();
    const list = $(xmlContent.match(/<li>[\s\S]+?<\/li?>/g));

    const items = list.map((index, item) => {
        item = $(item);
        const title = item.find('a:last-child').text();
        const link = `${baseLink}/${item.find('a:last-child').attr('href')}`;
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

    const itemsWithContent = await Promise.all(
        items.get().map(async (item) => {
            const response = await got.get(item.link);

            const $ = cheerio.load(response.data);
            const content = $('.article-content').html();
            item.description = content;

            return Promise.resolve(item);
        })
    );
    ctx.state.data = {
        title,
        link: baseLink,
        item: itemsWithContent,
    };
};
