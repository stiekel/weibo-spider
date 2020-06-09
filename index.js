const profile = require('./src/profile');
const topic = require('./src/topic');
const config = require('./config')
class WeiboSpider {
    constructor(options = {}) {
        Object.assign(config, options)
        if (!config.cookie || config.cookie === '__your_cookie_here__') {
            console.error('ERROR: weibo cookie required!')
        }
    }
    async profile() {
        return profile(...arguments)
    }
    async topic() {
        return topic(...arguments)
    }
}
module.exports = WeiboSpider;
