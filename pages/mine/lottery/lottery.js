// pages/mine/lottery/lottery.js
const app = getApp();
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    animationData: {},
    clickBtnRotate: 0,
    lotteryList: [],
    recordList: [],
    score: '',
    start: false,
    format: ['-', '-', ' ', ':', ':', ' ']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScore();
    this.getLotteryList();
    this.getRecordList();
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
    var animationRotate = wx.createAnimation({
      transformOrigin: "50% 61%",
      duration: 7000,
      timingFunction: "ease",
      delay: 0
    })
    this.animationRotate = animationRotate;
  },
  btnAnimate: function () {
    if (this.data.start) {
      return
    }
    this.setData({
      start: true
    })
    this.getScore();
    let that = this;
    const lotteryList = this.data.lotteryList;
    app.fetch({
      url: '/operate/prize/draw',
      data: {
        group: 'WX_APP_DZP'
      },
      errFn: function () {
        that.setData({
          start: false
        })
      }
    })
      .then((response) => {

        let num;
        for (let i = 0; i < lotteryList.length; i++) {
          if (response.prizeId == lotteryList[i].id) {
            num = i;
          }
        }
        const newRotate = Math.ceil(that.data.clickBtnRotate / 360) * 360 + 3600 + 60 + (num + 1) * 60;
        that.animationRotate.rotate(newRotate).step();
        that.setData({
          clickBtnRotate: newRotate,
          animationData: that.animationRotate.export()
        })
        setTimeout(function(){
          wx.showToast({
            title: '恭喜您获得了' + response.name,
            icon: 'none',
            duration: 2000,
            mask: true
          })
          setTimeout(function () {
            that.getRecordList();
            that.setData({
              start: false
            })
          },1500)
        },7000)
      })

  },
  // 获取积分
  getScore: function () {
    app.fetch({
      url: '/account/user/info'
    })
      .then((response) => {
        console.info(response)
        this.setData({
          score: response.score
        })
      })
  },
  // 获取所有奖品列表
  getLotteryList: function () {
    app.fetch({
      url: '/operate/prize/findPrizeByGroup',
      data:{
        group: 'WX_APP_DZP'
      }
    })
      .then((response) => {
        console.info(response)
        this.setData({
          lotteryList: response
        })
      })
  },
  // 获取中奖纪录
  getRecordList: function () {
    app.fetch({
      url: '/operate/prize/findLogByUserId',
      data: {
        status: 0
      }
    })
      .then((response) => {
        console.info(response)
        let recordList = response;
        for (let i = 0; i < recordList.length; i++) {
          recordList[i].createTime = utils.formatTime(recordList[i].createTime, this.data.format);
        }
        this.setData({
          recordList: recordList
        })
      })
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

  }
})