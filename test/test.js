const chai = require('chai');
const expect = chai.expect;
chai.config.includeStack = true;
const weiboSpider = require('../index');

describe('Profile', () => {
    it('用户资料结果对象检查', (done) => {
        weiboSpider.profile(1093571043).then(r => {
            expect(r).to.be.a('object')
            expect(r.url).to.equal('https://weibo.cn/1093571043/info')
            expect(r.nickname).to.equal('不可能不确定')
            expect(r.gender).to.equal('男')
            expect(r.area).to.equal('青海 果洛')
            expect(r.birthday).to.equal('0001-00-00')
            expect(r.tags).to.deep.equal([ 'Veer', 'Android控', 'NexusOne' ])
            done()
        })
    })
});
