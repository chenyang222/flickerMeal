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
    itemdef: [
      { name: 'sir', value: '设为默认地址' }
    ]
    // customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var state = currentPage.options.state
    // console.log(state);
    // console.log(currentPage);
    // console.log(editsds);
    // console.log(editname);
    
    if (state == 1){
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      var editname = currentPage.options.editname
      var editphone = currentPage.options.editphone
      var editsds = currentPage.options.editsds
      var isdefault = currentPage.options.isdefault
      // console.log(editsds);
      var addlist = editsds.split('  ');//地址已空格隔开
      // console.log(ooo);
      var ppp = editname.split('（');
      // console.log(ppp);
      this.setData({
        editname: ppp[0],//回显联系人姓名
        editphone: editphone,//回显联系人手机号
        // region: [addlist[0]],//回显地址
        region: [addlist[0], addlist[1], addlist[2]]
      })
      if (ppp[1] == "先生）"){
        console.log("xiansheng");
        this.setData({
            items: [
              { name: 'sir', value: '先生', checked: 'true' },
              { name: 'ms', value: '女士', },
            ],
        })
      }else{
        console.log("nvshi");
        this.setData({
          items: [
            { name: 'sir', value: '先生', },
            { name: 'ms', value: '女士', checked: 'true' },
          ],
        })
      }//性别回显
      console.log(isdefault);
      if (isdefault == 1){
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
  HouseNumber: function (e) {
    var that = this;
    that.setData({
      housenum: e.detail.value,
    })
  },//门牌号
  radioChange: function (e) {
    var that = this;
    that.setData({
      sex: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },//选择性别
  radioDefault: function (e) {
    var that = this;
    that.setData({
      default: e.detail.value,
    })
    console.log('radio默认地址：', e.detail.value)
  },//选择默认地址
  submitbtn: function () {
    var that = this;
    console.log(that.data.name);
    console.log(that.data.phone);
    console.log(that.data.region[0]);
    console.log(that.data.housenum);
    console.log(that.data.sex);
    console.log(that.data.default);
    if (that.data.sex == 0) {
      that.setData({
        sexname: '（先生）',
      })
    } else if (that.data.sex == 1) {
      that.setData({
        sexname: '（女士）',
      })
    } else {
      that.setData({
        sexname: '',
      })
    }

    if (that.data.default == 0) {
      that.setData({
        adssdefault: '1',
      })
    } else {
      that.setData({
        adssdefault: '0',
      })
    }
    console.log(that.data.sexname);
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
    // if (that.data.housenum == '' || that.data.housenum == undefined) {
    //   wx.showToast({
    //     title: '详细地址不能为空',
    //     icon: "none",
    //     duration: 1500
    //   })
    //   return;
    // } 
      wx.request({
        url: app.globalData.baseUrl + 'userInfo/addAddress.action',
        data: {
          userId: 1,
          name: that.data.name + '' + that.data.sexname,
          address: that.data.region[0] + '  ' + that.data.region[1] + '  ' + that.data.region[2],
          phone: that.data.phone,
          // detailAddress: that.data.housenum,
          isDefault: that.data.adssdefault
        },
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log(res);
            wx.showToast({
              title: '新增地址成功',
              icon:"none",
              duration: 1500
            })
          }
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

  }
})
