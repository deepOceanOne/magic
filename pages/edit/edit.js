Page({

  /**
   * 聊天室使用到的数据，主要是消息集合以及当前输入框的文本
   */
  data: {
    inputContent: '在干嘛呢',
    lastTodoId: 'none',
    key:"",
    todos: [{"content":'开启美好的新一天！'}],
    msgUuid:{"next":0,}
  },

  onLoad: function (options) {
    this.setData({
      key:options.key
    });
    wx.setNavigationBarTitle({
      title: 'Todos in  '+options.key,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onReady() {
    if (!this.pageReady) {
      this.pageReady = true;
    }
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

    console.log('setstorage done...');

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
  },

  sendTodo(){
    this.pushTodo(this.createTodo(this.data.inputContent));
    this.setData({ inputContent: '' });
  }


});