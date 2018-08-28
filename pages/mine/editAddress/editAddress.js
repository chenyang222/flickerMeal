// pages/mine/editAddress/editAddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgdata: app.globalData.imgdata,
    editid: '', // 地址id
    editConsignee: '', // 收货人
    sex: '', // 性别
    editphone: '', // 电话编辑
    editAddress: '', // 编辑详细地址
    areaCode: ['选择收货地址'],
    items: [
      { name: 'sir', value: '先生' },
      { name: 'ms', value: '女士', },
    ],
    itemdef: [
      { name: 'sir', value: '设为默认地址' }
    ],
    isdefault: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '修改地址'
    })
    console.info(11111111)
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var state = currentPage.options.state
    console.info(currentPage.options)
    var editid = currentPage.options.editid
    var sex = currentPage.options.sex
    var editConsignee = currentPage.options.editConsignee
    var editphone = currentPage.options.editphone
    var addlist = currentPage.options.editAreaCode.split(',')
    var editAddress = currentPage.options.editAddress
    var isdefault = currentPage.options.isdefault
    
    this.setData({
      editid: editid,
      editConsignee: editConsignee,//回显联系人姓名
      sex: sex,
      editphone: editphone,//回显联系人手机号
      areaCode: [addlist[0], addlist[1], addlist[2]],
      editAddress: editAddress,
      isdefault: isdefault
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
    }

    if (isdefault == 0){
      this.setData({
        itemdef: [
          { name: 'sir', value: '设为默认地址', checked: 'true' }
        ]
      })
    }
  },
  //姓名
  bindReplaceInput: function (e) {
    var that = this;
    that.setData({
      editname: e.detail.value,
    })
  },
  //选择性别 
  radioChange: function (e) {
    var that = this;
    that.setData({
      sex: e.detail.value,
    })
  },
  //手机号
  bindPhoneInput: function (e) {
    var that = this;
    that.setData({
      editphone: e.detail.value,
    })
  },
  //省市联动
  bindRegionChange: function (e) {
    this.setData({
      areaCode: e.detail.value
    })
  },
  //门牌号
  addressChange: function (e) {
    var that = this;
    that.setData({
      editAddress: e.detail.value,
    })
  },
  //选择默认地址
  radioDefault: function (e) {
    var that = this;
    that.setData({
      isdefault: e.detail.value,
    })
  },
  submitbtn: function () {
    console.info(11)
    var that = this;
    // 验证姓名
    if (this.data.editConsignee == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // 验证是否选择性别
    if (this.data.sex == '') {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // 验证是否填写手机号
    if (this.data.editphone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // 验证是否选择地址
    if (this.data.areaCode[0] == '' || this.data.areaCode[0] == undefined || this.data.areaCode[1] == '' || this.data.areaCode[1] == undefined || this.data.areaCode[2] == '' || this.data.areaCode[2] == undefined) {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // 验证是否填写详细地址
    if (this.data.editAddress == '') {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    const data = {
      id: this.data.editid,
      consignee: this.data.editConsignee,
      sex: this.data.sex,
      mobile: this.data.editphone,
      areaCode: this.data.areaCode.join(','),
      address: this.data.editAddress,
      name: this.data.editAddress,
      defaultFlag: this.data.isdefault == '' ? 1 : 0,
      pos: ''
    }
    console.info(data)
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
