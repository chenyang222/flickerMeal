const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    name: '',
    position: '',
    phone: '',
    company: '',
    address: ''
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputPosition: function (e) {
    this.setData({
      position: e.detail.value
    })
  },
  inputCompany: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  onLoad: function (options) {

  },
  joinBtn: function () {
    const data = {};
    data.position = this.data.position;
    data.name = this.data.name;
    data.phone = this.data.phone;
    data.company = this.data.company;
    data.address = this.data.address;
    // form拦截
    if (!data.position || !data.name || !data.phone || !data.company || !data.address) {
      wx.showToast({
        title: '请您将加盟信息填写完整',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    console.info(data)
    app.fetch({
      url: '/fastfood/joinpartner/save',
      data: data
    })
      .then((response) => {
        wx.showToast({
          title: '提交加盟信息成功',
          icon: 'none',
          duration: 2000
        })
      })
  }
})