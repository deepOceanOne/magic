/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');
const AV = require('../../libs/av-weapp-min.js');

// 显示按钮使用提示
var showTips = text => wx.showToast({
    title: text,
    icon: 'tips',
    duration: 3000,
});



/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
        loginUrl: config.service.loginUrl,
        requestUrl: config.service.requestUrl,
        tunnelUrl: config.service.tunnelUrl,
        date:"",
        day:"",
        time:"",
        month:"",
        year:"",
        touch_start:0,
        touch_end:0,
        todos:[{"content":"空空如也，长按右下角红色按钮添加日程安排吧"},{"content":"tips:长按一秒为添加第二天的日程，长按两秒为添加第三天的日程安排，以此类推。。。。。。"}],
        todos_unlocked:[{}]
    },



    onLoad(){

        // read the date and time 
        var d = new Date();
        var date,day,year,time,month;

        date = d.getDate()<10?'0'+d.getDate():d.getDate();
        year = d.getFullYear();
        // set day 
        switch(d.getDay()){
          case 0 :
            day = "Sunday";
            break;

          case 1 :
            day = "Monday";
            break;

          case 2 :
            day = "Tuesday";
            break;

          case 3 :
            day = "Wednesday";
            break;

          case 4 :
            day = "Thursday";
            break;

          case 5 :
            day = "Friday";
            break;

          case 6 :
            day = "Saturday";
            break;    
        }

        

        month = d.getMonth()+1;

        // set time 
        var hours = d.getHours()<10?'0'+d.getHours():d.getHours();
        var mins = d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
        time = hours +" : "+mins;
       

        this.setData({ time : time });
        this.setData({ day : day });
        this.setData({ date : date });
        this.setData({ month : month });
        this.setData({ year : year });

        var todosfromstorage = wx.getStorageSync(month+'-'+(date));
        if(todosfromstorage){
          this.setData({todos:todosfromstorage});
        }

        AV.init({
          appId: config.secret.lean.appId,
          appKey: config.secret.lean.appKey,
        });

    },

    onReady(){

      //showTips('长按红色按钮添加备忘......');
    
      this.test_read();

    },
    
    onShow(){
      wx.setNavigationBarTitle({
        title: 'TodayPro',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    /**
     * 点击「登录」按钮，测试登录功能
     */
    doLogin() {
       
    },

    test_read(){
      var query = new AV.Query('db_0987');
      query.select("content");
      var query_list = query.find();
      for( var todo in query_list){
          
          console.log(todo);
      }
      //console.log(this.todos_unlocked.content);

    },

    test_write(){
      var testobj = AV.Object.extend("db_0987");
      var test = new testobj();
      test.save({
        content:"Hello jxc!"
      }).then(function(onject){
        alert("");
      })
    },

    /**
     * 点击「清除会话」按钮
     */
    clearSession() {
        // 清除保存在 storage 的会话信息
        //qcloud.clearSession();
        showSuccess('会话已清除');
    },


    /**
     * 点击「请求」按钮，测试带会话请求的功能
     */
    doRequest() {
      
    },

    // tools 
    daysOfMonth(year, month) {
      return 32 - new Date(year, month, 32).getDate();
    },

    afterButtonClicked() {
      // 根据按下的秒数，来换算成实际的天数，在相应的月份和天数之后进行记录
      var touchTime = this.data.touch_end - this.data.touch_start;
      var touchTime2Day = Math.round(touchTime / 1000 + 1);
      //console.log(" after  " +touchTime2Day + '  days '); 
      var month2Storage = 0;
      var days2Storage = 0;
      var _daysofmonth = this.daysOfMonth(this.data.year,this.data.month);
      month2Storage =  ((this.data.date+touchTime2Day)>_daysofmonth)? this.data.month+2:this.data.month;
      days2Storage = (month2Storage == this.data.month)? this.data.date+touchTime2Day:this.data.date+touchTime2Day-_daysofmonth;
      //console.log("month2Storage is :" + month2Storage);
      //console.log("days2Storage is :" + days2Storage);

/*
      wx.navigateTo({
        url: '../edit/edit?key='+month2Storage+'-'+days2Storage,
      });
*/
      // temp use
      wx.navigateTo({
        url: '../unlock/unlock'
      });

      wx.setNavigationBarTitle({
        title: 'Todo in  ' + month2Storage + '-' + days2Storage
      });
      

      //console.log(this.data.month);
    
    },

    touchstart(e){
      //console.log("touch start");
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
      //console.log(e.timeStamp + '- touch-start'); 
    },

    touchend(e){
      //console.log("touch end");
      let that = this;
      that.setData({
        touch_end: e.timeStamp
      });
      //console.log(e.timeStamp + '- touch-end');
    },
    
   
   
 
});
