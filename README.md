MagicPro 日程助手小程序
=====================================


## 源码简介

```tree
MagicPro
├── LICENSE
├── README.md
├── app.js
├── app.json
├── bower.json
├── config.js
├── package.json
├── pages
│   ├── edit
│   │   ├── edit.js
│   │   ├── edit.wxml
│   │   └── edit.wxss
│   └── index
│       ├── index.js
│       ├── index.wxml
│       └── index.wxss
└── vendor
    └── qcloud-weapp-client-sdk/
```

`app.js` 是小程序入口文件。

`app.json` 是小程序的微信配置，其中指定了本示例的两个页面，页面分别在 `pages/index/` 和 `pages/edit/` 目录下。

`config.js` 是我们小程序自己的业务配置。

`vendor/qcloud-weapp-client-sdk` 是[客户端 SDK](https://github.com/tencentyun/weapp-client-sdk) 的一份拷贝。

## 关于使用

本程序简单易用

首页为当天日程安排

长按右下角红色按钮可以添加备忘，长按一秒为第二天添加备忘，长按2秒为第三天添加备忘，以此类推。。。
