const chai = require('chai');
const expect = chai.expect;
chai.config.includeStack = true;
const weiboSpider = require('../index');

describe('weibo-spider', () => {
    describe('Profile', () => {
        it('用户资料结果对象检查', async () => {
            return weiboSpider.profile(1065918465).then(r => {
                expect(r).to.be.a('object');
                expect(r.url).to.equal('https://weibo.cn/1065918465/info');
                expect(r.nickname).to.equal('乐毅的刑法江湖');
                expect(r.gender).to.equal('男');
                expect(r.area).to.equal('其他');
                expect(r.birthday).to.equal('0001-00-00');
            });
        });
    });
    describe('Topic', () => {
        it('搜索关键字', async () => {
            return weiboSpider.topic('你捐的衣服去哪里了').then(r => {
                expect(r).to.be.a('object');
                expect(r.totalCount).to.be.a('number');
                expect(r.totalCount >= 0).to.be.equal(true);
            });
        })
    });
});
