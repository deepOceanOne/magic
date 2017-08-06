var Bmob = require('../../libs/bmob.js');
var config = require('../../config');

Page({

  /**
   * 聊天室使用到的数据，主要是消息集合以及当前输入框的文本
   */
  data: {
    inputContent: '',
    lastTodoId: 'none',
    key:"",
    todos: [{"content":'美好的一天开始啦～'}],
    msgUuid:{"next":0,},
    // recommendation array 
    recoms: [],  
  },

  onLoad: function (options) {

    Bmob.initialize(config.secret.bomb.appId, config.secret.bomb.apikey);

    this.setData({
      key:options.key
    });
    var todosfromstorage = wx.getStorageSync(options.key);
    if(todosfromstorage){
      this.setData({todos:todosfromstorage});
    }
    
  },

  onReady() {
    if (!this.pageReady) {
      this.pageReady = true;
    }
  },

  onShow(){
    wx.setNavigationBarTitle({
      title: 'Todos in  ' + this.data.key,
      success: function (res) { },
      fail: function (res) { 
        console.log("set NavigationBarTitle failed ...");
      },
      complete: function (res) { },
    });

    // show recommendations  
    // the following code fragment may be not safe to be used 
    var Diary = Bmob.Object.extend("New");
    var query = new Bmob.Query(Diary);
    var recom_array = [];
    // query.equalTo  .... 
    query.limit(3);
    query.ascending("createAt");
    var context = this;
    query.find({
      success:function(results){
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          recom_array.push({"content" : object.get('title')});
          object.destroy({
            success: function (deleteObject) {
              //console.log('删除日记成功');
            },
            error: function (object, error) {
              console.log('删除日记失败');
            }
          });
        }
        context.setData({recoms:recom_array});
      },
      error:function(error){
        console.log("query of recommendations error ... ");
      }
    })


  },

  /**
   * 用户输入的内容改变之后
   */
  changeInputContent(e) {
    this.setData({ inputContent: e.detail.value });
  },

  /**
     * 通用更新当前消息集合的方法
     */
  updateTodos(updater) {
    var todos = this.data.todos;
    updater(todos);

    this.setData({ todos });

    // 需要先更新 todos 数据后再设置滚动位置，否则不能生效
    var lastTodoId = todos.length ? todos[todos.length - 1].id : 'none';
    this.setData({ lastTodoId });

    wx.setStorage({
      key: this.data.key,
      data: todos,
    });

    //console.log('setstorage done...');

  },

  /**
  * 生成一条Todo消息的唯一 ID
  */
  msgUuid() {
    if (!this.data.msgUuid.next) {
      this.data.msgUuid.next = 0;
    }
    return 'msg-' + (++this.data.msgUuid.next);
  },

  /**
  * 生成Todo消息
  */
  createTodo(todo) {
    return { id: this.msgUuid(), content : todo };
  },

  /**
   * 追加一条消息
   */
  pushTodo(todo) {
    this.updateTodos(todos => todos.push(todo));

    // upload and update 
    var Diary = Bmob.Object.extend("today");
    var query = new Bmob.Query(Diary);
    var pass = wx.getStorageSync("mypass");
    console.log("pass is : "+pass);
    if(pass){
        query.equalTo("code", pass);
        query.equalTo("day", this.data.key);
        var context = this;
        query.find({
          success: function (results) {
            //console.log("共查询到 " + results.length + " 条记录");
            // 循环处理查询到的数据
            if (results.length != 0) {
              // then update it 
              results[0].unset("content");
              var tmptodos = context.data.todos;
              tmptodos.forEach(function (val) {
                results[0].add("content", val.content);
              });
              results[0].save();
            }else{
              // set a new one then 
              var diary = new Diary();
              diary.set("code", pass);
              diary.set("day", context.data.key);
              diary.set("mediatype", "text");
              var tmptodos = context.data.todos;
              tmptodos.forEach(function (val) {
                diary.add("content", val.content);
              })
              //添加数据，第一个入口参数是null
              diary.save();
            }

          },
          error: function (error) {
            console.log("查询失败...");
          }
        });
    }



  },

  sendTodo(){
    if (!this.data.inputContent){
      // 写完就返回～  发送空白内容进行返回操作
      // 返回主页
      wx.navigateBack();
    }else{
      this.pushTodo(this.createTodo(this.data.inputContent));
      this.setData({ inputContent: '' });
    }

  },

  // recommendation area 
  clicked(e){
    // well , this recommended content is received 
     var index_clicked = (e.currentTarget.id);
     // remove it from the recom array 
     var recom_array = this.data.recoms;
     // first move the clicked one to local todo array 
     this.pushTodo(this.createTodo(recom_array[index_clicked].content));
     var item_moved = recom_array.splice(index_clicked,1);
     this.setData({recoms:recom_array});
     // end of remove effect 

  },

  // 如果有人提出了意见，智能识别出来并进行上传记录
  isSuggestion(content){
    // make judge if the content is a piece of advice
    return false;
  }



});