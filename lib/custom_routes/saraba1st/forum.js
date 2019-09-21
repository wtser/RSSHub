const got = require('@/utils/got');
const cheerio = require('cheerio');
const baseLink = 'https://bbs.saraba1st.com/2b';

module.exports = async (ctx) => {
    const { id } = ctx.params;
    const response = await got.get(`${baseLink}/forum-${id}.html`);
    const $ = cheerio.load(response.data);
    const title = $('title').text();
    const list = $('[id^=normalthread]');

    const items = list.map((index, item) => {
        item = $(item);
        const $link = item.find('a.s.xst');
        const title = $link.text();
        const link = `${baseLink}/${$link.attr('href')}`;
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
