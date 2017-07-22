/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = '42926794.qcloud.la';

var config = {

    // 下面的地址配合云端工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/tunnel`,
    },

    secret : {
      
      //bomb storage use
      bomb: {
        appId: '870f77c1d1cbb1b0efb9a9c857049a9f',

        apikey: '34fb79ded1826ed0df1c4784844581c4',
      },
    }
};


module.exports = config;