// pages/mine/newaddress/newaddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    region: ['选择收货地址'],
    items: [
      { name: 'sir', value: '先生' },
      { name: 'ms', value: '女士', },
    ],
    sex: '',
    itemdef: [
      { name: 'sir', value: '设为默认地址' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var state = currentPage.options.state
    console.log(state);
    if (state == 1){
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      console.info(currentPage.options)
      var editid = currentPage.options.editid
      var editConsignee = currentPage.options.editConsignee
      var editphone = currentPage.options.editphone
      var addlist = currentPage.options.editAreaCode.split(',')
      var editAddress = currentPage.options.editAddress
      var isdefault = currentPage.options.isdefault
      var sex = currentPage.options.sex
      this.setData({
        editname: editConsignee,//回显联系人姓名
        name: editConsignee,
        editphone: editphone,//回显联系人手机号
        phone: editphone,
        region: [addlist[0], addlist[1], addlist[2]],
        editAddress: editAddress,
        housenum: editAddress,
        state: state,
        editid: editid,
        sex: sex
      })
      if (sex == 1){
        this.setData({
            items: [
              { name: 'sir', value: '先生', checked: 'true' },
              { name: 'ms', value: '女士', },
            ],
        })
      }else{
        this.setData({
          items: [
            { name: 'sir', value: '先生', },
            { name: 'ms', value: '女士', checked: 'true' },
          ],
        })
      }//性别回显
      if (isdefault == 0){
        console.info(111)
        this.setData({
          itemdef: [
            { name: 'sir', value: '设为默认地址', checked: 'true' }
          ]
        })
      }
    }else{
      wx.setNavigationBarTitle({
        title: '新增地址'
      })
    }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },//省市联动
  bindReplaceInput: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value,
    })
  },//姓名
  bindPhoneInput: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value,
    })
  },//手机号
  houseNumber: function (e) {
    var that = this;
    that.setData({
      housenum: e.detail.value,
    })
    console.info(e.detail.value)
  },//门牌号
  radioChange: function (e) {
    var that = this;
    that.setData({
      sex: e.detail.value,
    })
  }, //选择性别
  addressChange: function (e) {
    var that = this;
    that.setData({
      editAddress: e.detail.value,
    })
  },
  radioDefault: function (e) {
    var that = this;
    that.setData({
      default: e.detail.value,
    })
  },//选择默认地址
  submitbtn: function () {
    var that = this;
    if (that.data.default == 1) {
      that.setData({
        adssdefault: '1',
      })
    } else {
      that.setData({
        adssdefault: '0',
      })
    }

    if (!that.data.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (that.data.name == '' || that.data.name == undefined) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
     if (that.data.phone == '' || that.data.phone == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    } 
    if (that.data.region[0] == '' || that.data.region[0] == undefined || that.data.region[1] == '' || that.data.region[1] == undefined || that.data.region[2] == '' || that.data.region[2] == undefined) {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    const data = {
      defaultFlag: this.data.adssdefault,
      consignee: this.data.name,
      mobile: this.data.phone,
      areaCode: this.data.region.join(','),
      pos: '',
      address: this.data.housenum,
      name: this.data.housenum,
      sex: that.data.sex
    }
    console.info(data)

    if (this.data.state == 1) {
      data.id = this.data.editid;
      app.fetch({
        url: '/account/address/update',
        method: 'post',
        data: data
      })
        .then((response) => {
          wx.showToast({
            title: '修改地址成功',
            icon: "none",
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        })
    } else {
      app.fetch({
        url: '/account/address/save',
        method: 'post',
        data: data
      })
        .then((response) => {
          wx.showToast({
            title: '新增地址成功',
            icon: "none",
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        })
    }
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

  }
})
