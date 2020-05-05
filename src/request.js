const superagent = require('superagent');
const cheerio = require('cheerio');
const config = require('../config');
const utils = require('./utils');
let LAST_AT = 0;

/**
 * 发起请求
 * @param {string} method
 * @param {string} url
 * @param {object} params
 * @return {response} cheerio object
 */
module.exports = async (method, url, query, body, headers = {}) => {
    // 两次请求，间隔 config.requestInterval 的时间
    let currentTS = new Date().getTime();
    if (currentTS - LAST_AT < config.requestInterval) {
        await utils.sleep(currentTS - LAST_AT);
    }
    LAST_AT = currentTS;
    return new Promise((resolve, reject) => {
        let agent = superagent[method](url);
        agent.set(`Accept`, `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`)
        for (let key in headers) {
            agent.set(key, headers[key]);
        }
        if (query) {
            agent = agent.query(query);
        }
        if (body) {
            agent = agent.send(body);
        }
        agent.set('Cookie', config.cookie).then(res => {
            let $ = cheerio.load(res.text, {
                normalizeWhitespace: true,
                decodeEntities: false
            });
            return resolve($);
        }).catch();
    });
};
