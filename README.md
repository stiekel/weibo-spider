# weibo-spider

## 初始化

```js
const WeiboSpider = require('weibo-spider')
let weiboSpider = new WeiboSpider({
    cookie: 'you cookie here',
    requestInterval: 300
})
```

## 获取用户资料详情

用法如下：

```js
weiboSpider.profile(1065918465)
```

返回值如下：

```js
{
    userName: '',           // 微博作者名字
    userLink: '',           // 微博作者主页链接
    userDaren: false,       // 是否是达人
    isOrgin: false,         // 是否是原创
    hasVideo: false         // 是否包含视频
}
```

## 获取搜索结果

用法如下：

```js
weiboSpider.topic({
    keyword: '你捐的衣服去哪里了',
    starttime: '20200419',
    endtime: '20200420'
})
```

返回结果示例如下：

```js
{
  "totalCount": 10,
  "mblogs": [
    {
      "id": "IEePnEdbU",
      "content": "",
      "isOrgin": true,
      "hasVideo": false,
      "attribudeCount": 0,
      "repostCount": 0,
      "commentCount": 0,
      "addFavCount": 0,
      "author": {
        "userName": "民生时刻",
        "userLink": "https://weibo.cn/u/6586581125",
        "isDaren": false,
        "isV": false,
        "isVIP": false,
        "userDaren": false
      }
    },
    {
      "id": "IEePnBvcO",
      "content": "",
      "isOrgin": true,
      "hasVideo": false,
      "attribudeCount": 0,
      "repostCount": 0,
      "commentCount": 0,
      "addFavCount": 0,
      "author": {
        "userName": "关注趣闻君",
        "userLink": "https://weibo.cn/u/6405076916",
        "isDaren": false,
        "isV": false,
        "isVIP": false,
        "userDaren": false
      }
    }
  ],
  "nextUrl": "https://weibo.cn/search/mblog?hideSearchFrame=&keyword=%E4%BD%A0%E6%8D%90%E7%9A%84%E8%A1%A3%E6%9C%8D%E5%8E%BB%E5%93%AA%E9%87%8C%E4%BA%86&advancedfilter=1&starttime=20200417&endtime=20200420&sort=time&page=2",
  "keyword": "你捐的衣服去哪里了"
}
```
