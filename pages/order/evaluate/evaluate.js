const app = getApp();
Page({
  data: {
    imgdata: app.globalData.imgdata,
    evaStars: 0,
    imageList: [],
    inputEvaValue: '',
    orderNo: '',
    machineName: '',
    orderid: ''
  },
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo,
      machineName: wx.getStorageSync('machineName')
    })
    app.fetch({
      url: '/fastfood/foodorder/findOrderInfoByUser?orderNo=' + options.orderNo
    })
      .then((response) => {
        let mealsList = [];
        for (let i = 0; i < response.childs.length; i++) {
          let obj = {};
          obj.name = response.childs[i].productName;
          obj.checked = '';
          mealsList.push(obj)
        }
        this.setData({
          mealsList: mealsList,
          orderid: response.id
        })
      })
  },
  // 商品质量 星星点击
  clickStars: function (e) {
    const index = e.target.dataset.index;
    const starstype = e.target.dataset.starstype;
    if (starstype == 'plx') {
      this.setData({
        evaStars: index + 1
      })
    } else {
      this.setData({
        evaStars: index + 1 + this.data.evaStars
      })
    }
  },
  // 评价内容
  inputEva: function (e) {
    this.setData({
      inputEvaValue: e.detail.value
    })
  },
  // 上传图片
  chooseImage: function () {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res)
        this.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  // 点击预览图片
  previewImage: function (e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  clickFingers: function (e) {
    const index = e.target.dataset.index;
    const type = e.target.dataset.type;
    let list = this.data.mealsList;
    if (type == 'top') {
      if (list[index].checked == '') {
        list[index].checked = true
      } else {
        if (list[index].checked) {
          list[index].checked = ''
        } else {
          list[index].checked = false
        }
      }
    } else {
      if (list[index].checked === '') {
        list[index].checked = false
      } else {
        if (list[index].checked == false) {
          list[index].checked = ''
        } else {
          list[index].checked = false
        }
      }
    }
    this.setData({
      mealsList: list
    })
  },
  subEvaluate: function () {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
    let dataObj = {};
    const token = wx.getStorageSync("token");
    const productNameArr = [];
    const mealsList = this.data.mealsList;
    for (let i = 0; i < mealsList.length; i++) {
      if (mealsList[i].checked === true) {
        productNameArr.push(mealsList[i].name)
      }
    }
    const imageList = this.data.imageList;
    let imgArr = [];
    for (let i = 0; i < imageList.length; i++) {
      wx.uploadFile({
        url: 'https://shanchan.jergavin.com/fastfood/foodordercomment/upload',
        filePath: imageList[i],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          "Authorization": token
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          console.info(data)
          if (data.errcode == 0) {
            let obj = {};
            obj.sort = i;
            obj.picImg = data.data.uri;
            imgArr.push(obj)
            if (i == imageList.length - 1) {
              let body = {
                orderId: that.data.orderid,
                star: that.data.evaStars,
                content: that.data.inputEvaValue,
                productName: productNameArr.join(',')
              }
              dataObj.body = JSON.stringify(body);
              dataObj.picImgs = imgArr;
              console.info(dataObj)
              app.fetch({
                url: '/fastfood/foodordercomment/publish',
                method: 'post',
                requestBody: true,
                data: dataObj
              })
                .then((response) => {
                  wx.showToast({
                    title: '评价成功',
                    icon: 'none',
                    duration: 2000
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                })
            }
          } else {
            wx.showToast({
              title: data.errmsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {}
      })
    }
  }
})