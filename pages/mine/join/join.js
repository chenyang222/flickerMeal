const app = getApp();
Page({
  data: {
      imgdata: app.globalData.imgdata,
      selected: true,
      selected1: false,
  },
  onLoad: function (options) {
    //console.log(options);
  
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },//个人加盟
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },//公司加盟
  pername: function (e) {
    var that = this;
    that.setData({
      pername: e.detail.value,
    })
  },//个人姓名
  perphone: function (e) {
    var that = this;
    that.setData({
      perphone: e.detail.value,
    })
  },//个人电话
  peraddress: function (e) {
    var that = this;
    that.setData({
      peraddress: e.detail.value,
    })
  },//个人所在地区
  companyname: function (e) {
    var that = this;
    that.setData({
      companyname: e.detail.value,
    })
  },//公司个人姓名
  companyphone: function (e) {
    var that = this;
    that.setData({
      companyphone: e.detail.value,
    })
  },//公司电话
  companyaddress: function (e) {
    var that = this;
    that.setData({
      companyaddress: e.detail.value,
    })
  },//公司所在地区
  companyjob: function (e) {
    var that = this;
    that.setData({
      companyjob: e.detail.value,
    })
  },//公司职位
  company: function (e) {
    var that = this;
    that.setData({
      company: e.detail.value,
    })
  },//公司名称
  perchangePay:function(){
    var that = this;
    if (that.data.pername == '' || that.data.pername == undefined) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.perphone == '' || that.data.perphone == undefined) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isPhone = /^0?(13[0-9]|15[012356789]|19[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    var isMob = /^([0-9]|[-])+$/g;
    if (isPhone.test(that.data.perphone)) {
    } else {
      wx.showToast({
        title: '电话格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.peraddress == '' || that.data.peraddress == undefined) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/addAddress.action',
      data: {
        userId:1,
        name: that.data.pername,
        phone: that.data.perphone,
        address: that.data.peraddress
      },
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },//个人加盟提交
  compchangePay:function(){
    var that = this;
    if (that.data.companyname == '' || that.data.companyname == undefined) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.companyphone == '' || that.data.companyphone == undefined) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isPhone = /^0?(13[0-9]|15[012356789]|19[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    var isMob = /^([0-9]|[-])+$/g;
    if (isMob.test(that.data.companyphone) || isPhone.test(that.data.companyphone)) {
    } else {
      wx.showToast({
        title: '电话格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.companyaddress == '' || that.data.companyaddress == undefined) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'userInfo/addAddress.action',
      data: {
        userId: 1,
        name: that.data.companyname,
        phone: that.data.companyphone,
        address: that.data.companyaddress,
        companyJob: that.data.companyjob,
        companyName: that.data.company
      },
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },//公司加盟提交
})