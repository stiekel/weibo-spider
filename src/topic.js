const url = require('url');
const request = require('./request');
const cheerio = require('cheerio');
const utils = require('./utils');
// 高级搜索的提交地址
const SEARCH_BASE_URL = `https://weibo.cn/search/`;

/**
 * 获取关键词搜索结果
 * @param {string/} keyword 关键字
 * @param {function} onProgress 每获取一页，调用一次本函数
 * @return {object} {url: '', nickname: '', gender:'', area: '', tags: [], birthday: ''}
 */
const startFetch = async (keyword, onProgress) => {
    let $ = await request('post', SEARCH_BASE_URL, {}, {
            keyword,
            advancedfilter: 1,
            nick: '',
            starttime: '20200101',
            endtime: '20200418',
            sort: 'time',
            smblog: '搜索'
        }, {
            referer: 'https://weibo.cn/search/mblog?advanced=mblog&f=s',
            'content-type': 'application/x-www-form-urlencoded'
        })
    let result = resolveContent($);
    let nextUrl = result.nextUrl
    while (nextUrl && nextUrl.length) {
        let r = await fetchPage(nextUrl)
        if (typeof onProgress === 'function') {
            onProgress(r)
        }
        if (r && r.nextUrl !== undefined) {
            nextUrl = r.nextUrl
        }
        if (r && r.mblogs && r.mblogs.length) {
            result.mblogs = result.mblogs.concat(r.mblogs)
        }
        await utils.randomSleep(3e2, 8e2)
    }
    return {
        ...result,
        keyword
    };
};

/**
 * 某一个翻页的页面
 * @param {string} url 某个翻页中【下页】对应的链接
 */
const fetchPage = async url => {
    let $ = await request('get', url)
    return resolveContent($)
};

/**
 * 解析一个搜索结果页
 * @param {object} $ cheerio 对象
 * 相当于从高级搜索中获取结果
 * https://weibo.cn/search/mblog/?keyword=&advanced=mblog&rl=0&f=s
 * 搜索结果如下
    <div class="c" id="M_IDKxHtpY6">
        <div>
            <a class="nk" href="https://weibo.cn/u/2796053070">Mei小芸1122</a>
            <span class="cmt">
                转发了
                    <a href="https://weibo.cn/u/1548468693">污叔日记</a>
                的微博:
            </span>
            <span class="ctt">我们捐的旧衣服到底去哪里了！看完你还捐吗？污叔日记的微博视频</span>
            <span class="cmt">赞[37]</span>
            <span class="cmt">原文转发[117]</span>
            <a href="https://weibo.cn/comment/ICWZla1Hj?rl=1#cmtfrm" class="cc">
                原文评论[10]
            </a>
                <!---->
        </div>
        <div>
            <span class="cmt">转发理由:</span>
            <a href="/n/%E7%8E%8B%E5%B0%8F%E8%B4%B1SOL">@王小贱SOL</a>
            <img alt="[大毛略略]" src="//h5.sinaimg.cn/m/emoticon/icon/movies/abominable_2-c9c2cdd1f6.png" style="w
idth:1em; height:1em;">
            恶心�  
            <a href="https://weibo.cn/attitude/IDKxHtpY6/add?uid=7393003321&rl=1&st=677824">赞[0]</a>
            <a href="https://weibo.cn/repost/IDKxHtpY6?uid=2796053070&rl=1">转发[0]</a>
            <a href="https://weibo.cn/comment/IDKxHtpY6?uid=2796053070&rl=1#cmtfrm" class="cc">评论[0]</a>
            <a href="https://weibo.cn/fav/addFav/IDKxHtpY6?rl=1&st=677824">收藏</a>
            <span class="ct">04月17日 16:31 来自HUAWEI Mate30 Pro 5G</span>
        </div>
    </div>
    <div class="s"></div>
    <div class="c" id="M_IDroJrhWp">
        <div
            <a class="nk" href="https://weibo.cn/u/6405076830">万能小子</a>
            <img src="https://h5.sinaimg.cn/upload/2016/05/26/319/5338.gif" alt="V">
            <span class="ctt">:实拍小区捐的旧衣服到底去哪里了！看完你还捐吗？ 美好事件的微博视频 </span>
            <a href="https://weibo.cn/attitude/IDroJrhWp/add?uid=7393003321&rl=1&st=677824">赞[0]</a>
            <a href="https://weibo.cn/repost/IDroJrhWp?uid=6405076830&rl=1">转发[0]</a>
            <a href="https://weibo.cn/comment/IDroJrhWp?uid=6405076830&rl=1#cmtfrm" class="cc">评论[0]</a>
            <a href="https://weibo.cn/fav/addFav/IDroJrhWp?rl=1&st=677824">收藏</a>
            <span class="ct">04月15日 15:47 来自几滴云</span>
        </div>
    </div>
 */
const resolveContent = ($) => {
    let result = {
        totalCount: 0,
        mblogs: [],
        nextUrl: ''
    };
    let eleTotal = $('div.c>span.cmt');
    if (eleTotal) {
        result.totalCount = eleTotal.html() || '共0条';
        result.totalCount = parseInt(result.totalCount.substr(1), 10);
    }
    let elePosts = $('div.c>div>a.nk')
    if (elePosts) {
        elePosts.map((idx, ele) => {
            let mblog = {};
            // 用户昵称
            mblog.userName = $(ele).html()
                // 用户链接
            mblog.userLink = $(ele).attr('href')
                // 是否达人
            mblog.userDaren = false;
            // 通过下一个元素的 html 是否以 转发了 打头，确定其是转发还是原创
            let nextElement = $(ele).next();
            let nextElementHtml = nextElement.html().trim();
            let nextElementTag = $(nextElement).prop('tagName');
            // 是否达人
            if (nextElementTag === 'IMG') {
                if ($(nextElement).attr('alt') === '达人') {
                    mblog.userDaren = true;
                    nextElement = $(nextElement).next();
                }
            }
            if (nextElementHtml.search('转发了') === 0) {
                mblog.isOrgin = false;
                nextElement = $(nextElement).parent().next();
                mblog.content = $(nextElement).text().split('赞[').shift().replace('转发理由:', '');
                // 跳转到
            } else {
                mblog.isOrgin = true;
                mblog.content = $(nextElement).text().trim();
            }
            if (mblog.content === '转发微博  ') {
                mblog.isOrgin = false;
            }
            result.mblogs.push(mblog);
        })
    }
    let elesNext = $('div#pagelist.pa a')
    elesNext.map((idx, ele) => {
        if (ele && cheerio.load(ele).text() === '下页') {
            result.nextUrl = $(ele).attr('href');
            if (result.nextUrl.startsWith('/search')) {
                result.nextUrl = url.resolve(SEARCH_BASE_URL, result.nextUrl)
            }
        }
    })
    return result;
}

module.exports = startFetch;
