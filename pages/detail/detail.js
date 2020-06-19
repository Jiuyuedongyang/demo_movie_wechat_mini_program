// pages/detail/detail.js

let datas = require('../../datas/list_data.js')
let appDatas = getApp();
console.log(appDatas, typeof appDatas)


console.log(datas)
// console.log('ss')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    index: null,
    isCollected: false,
    isMusicPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取参数值
    let index = options.index
    // console.log(index)

    //更新data中detailObj的状态值
    this.setData({
      detailObj: datas.list_data[index],
      //index:index 同名属性可以不写
      index
    })

    //根据本地缓存的数据判断用户是否收藏当前的文章
    let detailStorage = wx.getStorageSync('isCollected');
    console.log(detailStorage)


    if (!detailStorage) {
      //在缓存中初始化空对象
      wx.setStorageSync('isCollected', {})
    }
    //判断用户是否收藏
    if (detailStorage[index]) { //收藏过
      this.setData({
        isCollected: true
      })
    }
    //监听音乐播放
    wx.onBackgroundAudioPlay((res) => {
      console.log('监听音乐播放')
      //修改isMusicPlay状态值
      this.setData({
        isMusicPlay: true
      });
      //修改appDatas中的数据
      appDatas.data.isPlay = true
      appDatas.data.PageIndex = index
    });
    //监听音乐暂停
    wx.getBackgroundAudioManager().onPause((res) => {
      console.log('监听音乐暂停')
      //修改isMusicPlay状态值
      this.setData({
        isMusicPlay: false
      })
      //修改appDatas中的数据
      appDatas.data.isPlay = false
    })


    //判断音乐是否在播放
    if (appDatas.data.isPlay && appDatas.data.PageIndex === index) {
      //修改isMusicPlay状态值
      this.setData({
        isMusicPlay: true
      })
    }
  },






  handleCollection() {
    console.log(this)
    let isCollected = !this.data.isCollected
    this.setData({
      isCollected
    })

    //提示用户
    let title = isCollected ? '收藏成功' : '取消收藏'
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })

    //缓存数据到本地
    //{1:true,2:false}
    let {
      index
    } = this.data

    //let obj = {};//不可行，会覆盖原来状态
    wx.getStorage({
      key: 'isCollected',
      success: (datas) => {
        console.log(datas, typeof datas);
        let obj = datas.data; //拿到数据{0:true}

        obj[index] = isCollected;
        wx.setStorage({
          key: "isCollected",
          data: obj,
          success: () => {
            console.log("缓存成功")
          }

        })
      }
    })
  },
  handleMusicPlay() {
    //处理音乐播放
    let isMusicPlay = !this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    });

    //控制音乐播放
    if (isMusicPlay) {
      //播放音乐
      let {
        dataUrl,
        title
      } = this.data.detailObj.music;
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    } else {
      //暂停音乐
      wx.pauseBackgroundAudio()
    }


  },

  //点击处理分享功能
  handleShare: function () {
    wx.showActionSheet({
      itemList: ['分享到朋友圈','分享到微博','分享到qq空间'],
      itemColor: "#2D7CFF"
    })
  }




})