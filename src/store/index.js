import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      imgLoadStatus: false, // 壁紙加載狀態
      innerWidth: null, // 當前窗口寬度
      coverType: "0", // 壁紙種類
      siteStartShow: false, // 建站日期顯示
      musicClick: false, // 音樂連結是否跳轉
      musicIsOk: false, // 音樂是否加載完成
      musicVolume: 0, // 音樂音量;
      musicOpenState: false, // 音樂面板開啟狀態
      backgroundShow: false, // 壁紙展示狀態
      boxOpenState: false, // 盒子開啟狀態
      mobileOpenState: false, // 移動端開啟狀態
      mobileFuncState: false, // 移動端功能區開啟狀態
      setOpenState: false, // 設置頁面開啟狀態
      playerState: false, // 當前播放狀態
      playerTitle: null, // 當前播放歌曲名
      playerArtist: null, // 當前播放歌手名
      playerLrc: "歌詞加載中", // 當前播放歌詞
      playerLrcShow: true, // 是否顯示底欄歌詞
      footerBlur: true, // 底欄模糊
      playerAutoplay: false, // 是否自動播放
      playerLoop: "all", // 循環播放 "all", "one", "none"
      playerOrder: "list", // 循環順序 "list", "random"
    };
  },
  getters: {
    // 獲取歌詞
    getPlayerLrc(state) {
      return state.playerLrc;
    },
    // 獲取歌曲信息
    getPlayerData(state) {
      return {
        name: state.playerTitle,
        artist: state.playerArtist,
      };
    },
    //  獲取頁面宽度
    getInnerWidth(state) {
      return state.innerWidth;
    },
  },
  actions: {
    // 更改當前頁面宽度
    setInnerWidth(value) {
      this.innerWidth = value;
      if (value >= 720) {
        this.mobileOpenState = false;
        this.mobileFuncState = false;
      }
    },
    // 更改播放狀態
    setPlayerState(value) {
      if (value) {
        this.playerState = false;
      } else {
        this.playerState = true;
      }
    },
    // 更改歌词
    setPlayerLrc(value) {
      this.playerLrc = value;
    },
    // 更改歌曲數據
    setPlayerData(title, artist) {
      this.playerTitle = title;
      this.playerArtist = artist;
    },
    // 更改壁纸加载狀態
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
  },
  persist: {
    key: "data",
    storage: window.localStorage,
    paths: [
      "coverType",
      "musicVolume",
      "siteStartShow",
      "musicClick",
      "playerLrcShow",
      "footerBlur",
      "playerAutoplay",
      "playerLoop",
      "playerOrder",
    ],
  },
});
