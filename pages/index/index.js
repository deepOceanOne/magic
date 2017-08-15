/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');
var Bmob = require('../../libs/bmob.js');
var app = getApp();
// music search api


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
        day: "",
        date: "",
        time: " ❤️🐨  ",
        year: "",
        month: "",  
        touch_end: 0,
        touch_start: 0,  
        // 滑动事件使用        
        leftpadding: 30,
        startPoint: [0, 0],  
        todos_unlocked: [{}],
        loginUrl: config.service.loginUrl,
        requestUrl: config.service.requestUrl,   
        unlock_code:"0000", // default code is 0000,which is safe 
        todos: [],
        todos_local: [{ "content": "空空如也，长按左下角红色按钮添加日程安排吧" }, { "content": "tips again:右滑按钮绑定朋友的日程，如果闹掰了请重新绑定输入安全气囊密码：0000" }],
        // for audio display 
        audio:{
          // audio_src
          src: "",
          // audio_poster
          poster:"",
          // audio_name
          name:"",
          // audio_author
          author:""
        },
        // music search 
        musicList:[],
        hasMusic:0,
        userInfo: {},

    },

    // search music 
    searchMusic: function (e) {

     
     
    },

    getTimeAndTodo(){
      // read the date and time 
      var d = new Date();
      var date, day, year, time, month;

      // to get same with datepicker later 
      date = d.getDate();
      year = d.getFullYear();
      // set day 
      switch (d.getDay()) {
        case 0:
          day = "Sunday";
          break;

        case 1:
          day = "Monday";
          break;

        case 2:
          day = "Tuesday";
          break;

        case 3:
          day = "Wednesday";
          break;

        case 4:
          day = "Thursday";
          break;

        case 5:
          day = "Friday";
          break;

        case 6:
          day = "Saturday";
          break;
      }
      month = d.getMonth() + 1;
      // set time 
      var hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var mins = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      time = hours + " : " + mins;

      /*  no need for this time any more 
        this.setData({ time: time });
      */
      this.setData({ day: day });
      this.setData({ date: date });
      this.setData({ month: month });
      this.setData({ year: year });

      // console.log("date is : "+date);

      var todosfromstorage = wx.getStorageSync(month + '-' + (date));
      if (todosfromstorage) {
        this.setData({ todos_local: todosfromstorage });
        // make sure local data is first to be seen 
        this.setData({ todos: this.data.todos_local.concat(this.data.todos_unlocked) });
      }

    },


    onLoad(){
      
        this.getTimeAndTodo();
        Bmob.initialize(config.secret.bomb.appId, config.secret.bomb.apikey);
        
        wx.getStorage({
          key: 'pass',
          success: function(res) {},
          fail:function(){
            console.log("pass not set....");
            wx.setStorageSync("pass", "0000");
          }
        });

        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  var context = this;
                  //调用应用实例的方法获取全局数据
                  app.getUserInfo(function (userInfo) {
                    //更新数据
                    console.log("userinfo : " + userInfo);
                    context.setData({
                      userInfo: userInfo
                    });
                  });
                },
                fail(){
                  console.log("failed to get user information...")
                }
              })
            }
          }
        });

        this.searchMusic();

    },

    onReady(){
      this.setData({ unlock_code: wx.getStorageSync("pass") });
      this.getTodoFromFriends(this.data.unlock_code);

      // get audio src 
      var audio_array = ["src","poster","name","author"];
      var context = this;
      wx.request({
        url: 'https://todaypro.leanapp.cn/music',
        method:"GET",
        success:function(res){         
            context.setData({audio:res.data});          
        },
        fail:function(){
          console.log("request music src failed...");
        },
        complete:function(){
          // request completed ... 
        },
      });

      this.searchMusic();

    },  

    getTodoFromFriends(pass){
      var todos_unlocked = [];
      var Diary = Bmob.Object.extend("today");
      var query = new Bmob.Query(Diary);
      query.equalTo("code", pass);
      query.equalTo("day", this.data.month+'-'+this.data.date);
      var context = this;
      query.find({
        success: function (results) {
          //console.log("共查询到 " + results.length + " 条记录");
          // 循环处理查询到的数据
          if(results.length != 0){
            results[0].get('content').forEach(function (val) {
              todos_unlocked.push({ "content": val });
            });
          }  
          context.setData({ todos_unlocked: todos_unlocked });
          // refresh the todos 
          context.setData({ todos: context.data.todos_local.concat(context.data.todos_unlocked) });
        },
        error: function (error) {
          console.log("查询失败...");
        }
      });

    },
    
    onShow(){
      wx.setNavigationBarTitle({
        title: 'TodayPro',
        success: function (res) { },
        fail: function (res) {
          console.log("set NavigationBarTitle failed ...");
         },
        complete: function (res) { },
      });

      this.setData({
        leftpadding : 30
      });

      // add refresh 
      this.setData({ unlock_code: wx.getStorageSync("pass") });
      this.getTodoFromFriends(this.data.unlock_code);


    },

    /**
     * 点击「登录」按钮，测试登录功能
     */
    doLogin() {
       
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

      // if days are too long  use a datePicker
      // just jump to that 
        wx.navigateTo({
          url: '../datepicker/datepicker'
        });
      

    },

    touchstart(e){
      //console.log("touch start");
      let that = this;
      that.setData({
        touch_start: e.timeStamp
      });
      this.setData({
        startPoint:[e.touches[0].pageX,e.touches[0].pageY]
      });
      //console.log(e.timeStamp + '- touch-start'); 
    },

    touchend(e){
      //console.log("touch end");
      let that = this;
      that.setData({
        touch_end: e.timeStamp,
        leftpadding:30
      });
      //console.log(e.timeStamp + '- touch-end');
    },
    
    moved(e){
      // handle button slide event 
      // 当前接触点坐标
      var curPoint = [e.touches[0].pageX,e.touches[0].pageY];
      var startPoint = this.data.startPoint;
      // 比较pageX的值
      if(curPoint[0]>=startPoint[0]){
        if(Math.abs(curPoint[0]-startPoint[0])>= Math.abs(curPoint[1]-startPoint[1])){     
          //console.log("right move...");
          this.setData({leftpadding : 3*Math.abs(curPoint[0]-startPoint[0])})
          if (Math.abs(curPoint[0] - startPoint[0])>200){
            //console.log("right move...");
            // to unlock page 
            wx.navigateTo({
              url: '../unlock/unlock'
            });
            this.setData({startPoint : curPoint});
          }
        }
      }
    },

    onPullDownRefresh(){
      
      this.getTimeAndTodo();
      this.getTodoFromFriends(this.data.unlock_code);
      // 下拉刷新可以 看到 近来几天的日程 待实现
      // ......
      wx.stopPullDownRefresh();
      //this.settodos();

    },

    copytodo(e){
      var index = (e.currentTarget.id);
      console.log("index : "+e.currentTarget.id)
      var todo_array = this.data.todos;
      wx.setClipboardData({
        data: todo_array[index].content,
        success:function(res){
          wx.showToast({
            title: '已复制 : )',
          });
        },
        fail:function(){
          console.log("fail in copy");
        }
      });
    },

    nearby(){
      wx.navigateTo({
        url: '../nearby/nearby',
      })
    }

});
