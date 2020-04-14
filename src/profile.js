const request = require('./request');
const cheerio = require('cheerio');

/**
 * 获取用户资料
 * @param {string/number} id 会员ID
 * @return {object} {url: '', nickname: '', gender:'', area: '', tags: [], birthday: ''}
 */
module.exports = async id => {
    let result = {
        url: `https://weibo.cn/${id}/info`
    };
    let $ = await request('get', result.url)
    $('.c').map((index, ele) => {
        // 目前只处理基本信息
        if (index === 3) {
            let html = $(ele).html();
            let parts = html.split('<br>')
            parts.map(p => {
                let pureText = cheerio.load(p).text()
                switch(true) {
                    case pureText.search('昵称:') === 0:
                        result.nickname = pureText.replace('昵称:', '')
                        break;
                    case pureText.search('性别:') === 0:
                        result.gender = pureText.replace('性别:', '')
                        break;
                    case pureText.search('地区:') === 0:
                        result.area = pureText.replace('地区:', '')
                        break;
                    case pureText.search('生日:') === 0:
                        result.birthday = pureText.replace('生日:', '')
                        break;
                    case pureText.search('简历:') === 0:
                        result.description = pureText.replace('简历:', '')
                        break;
                    case pureText.search('标签:') === 0:
                        pureText = pureText.replace('标签:', '').replace(' 更多>>', '')
                        result.tags = pureText.split(' ')
                        break;
                }
            });
        }
    })
    return result;
};
