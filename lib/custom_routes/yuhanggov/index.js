const got = require('@/utils/got');
const cheerio = require('cheerio');
const date = require('@/utils/date');
const baseLink = 'http://www.yuhang.gov.cn';

module.exports = async (ctx) => {
    const { typeId } = ctx.params;
    const response = await got.get(`http://www.yuhang.gov.cn/module/xxgk/search.jsp?divid=div1229106886&infotypeId=${typeId}`);
    const $ = cheerio.load(response.data);
    const title = $('title').text() || `杭州余杭门户网站 法定主动公开内容`;
    const list = $(`.tab_box`);

    const items = list.map((index, item) => {
        item = $(item);
        const title = item.find('.sub_tab_span2').text();
        const link = `${item.find('a:last-child').attr('href')}`;
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
            const pubDate = $(`meta[name="PubDate"]`)[0].attribs.content;
            item.description = content;
            item.pubDate = date(pubDate);

            return Promise.resolve(item);
        })
    );
    ctx.state.data = {
        title,
        link: baseLink,
        item: itemsWithContent,
    };
};
