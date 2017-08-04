

// pages/unlock/unlock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

      focus1:true,
      focus2:false,
      focus3:false,
      focus4:false,
      pass : [],
      tips_first:"一个巴掌拍不响，分享从自己开始，设置你的专属秘钥",
      tips_second:"别人家的密码",
      tips: "别人家的密码"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var context = this;
    wx.getStorage({
      key: 'mypass',
      success: function (res) { 
        context.setData({ tips: context.data.tips_second });
      },
      fail: function () {
        console.log("my pass is not set  .....");
        context.setData({ tips: context.data.tips_first });
      }
    })
    

      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  afterClicked: function(){
    // after submit button clicked, start commit operation 
    

  },

  oninput1: function(e){
    this.setData({focus2:true});
    this.setData({focus1:false });
    this.data.pass.push(e.detail.value);
  },

  oninput2: function (e) {
    this.setData({focus3:true});
    this.setData({ focus2: false });
    this.data.pass.push(e.detail.value);
  },

  oninput3: function (e) {
    this.setData({ focus4: true });
    this.setData({ focus1: false });
    this.data.pass.push(e.detail.value);
  },

  oninput4: function (e) {
    // at last get the password totally
    this.data.pass.push(e.detail.value);
    // go back to main page 
    var pass = this.data.pass.join("");
    //console.log("password : " + pass);

    if(this.data.tips == this.data.tips_first){
      wx.setStorageSync("mypass", pass);     
    }else{
      wx.setStorageSync("pass", pass);
    }
    this.setData({pass:[]});
    wx.navigateBack();

  },


})