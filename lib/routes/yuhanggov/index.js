const got = require('@/utils/got');
const cheerio = require('cheerio');
const link = 'http://www.yuhang.gov.cn';

const hosts = ['http://www.yuhang.gov.cn/zmhd/wlwz/yggs/', 'http://www.yuhang.gov.cn/xxgk/zzjg/zf/qzfbgs_13675/bsyj/', 'http://www.yuhang.gov.cn/xxgk/zzjg/zf/qwbgs_13651/bsyj/', 'http://www.yuhang.gov.cn/xxgk/gggs/zbgg/jsgc/'];

module.exports = async (ctx) => {
    const hostsPromise = hosts.map((host) => got.get(host));

    const out = await Promise.all(hostsPromise).then(function(result) {
        return result.reduce((all, res) => {
            const url = res.requestUrl;
            const $ = cheerio.load(res.data);
            const list = $('.ZjYhN018');
            const out = list
                .map((index, item) => {
                    item = $(item);

                    const title = item.find('a:last-child').text();
                    const description = ` `;
                    const link = url + item.find('a:last-child').attr('href');
                    const guid = link;

                    const single = {
                        title,
                        description,
                        link,
                        guid,
                    };
                    return single;
                })
                .get();
            return all.concat(out);
        }, []);
    });

    ctx.state.data = {
        title: `余杭政务服务`,
        link: link,
        item: out,
    };
};
