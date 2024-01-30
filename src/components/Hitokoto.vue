<template>
  <div
    class="hitokoto cards"
    v-show="!store.musicOpenState"
    @mouseenter="openMusicShow = true"
    @mouseleave="openMusicShow = false"
    @click.stop
  >
    <!-- 打开音樂面板 -->
    <Transition name="el-fade-in-linear">
      <div
        class="open-music"
        v-show="openMusicShow && store.musicIsOk"
        @click="store.musicOpenState = true"
      >
        <music-menu theme="filled" size="18" fill="#efefef" />
        <span>打開音樂播放器</span>
      </div>
    </Transition>
    <!-- 句子内容 -->
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="hitokotoData.sentences[hitokotoData.current].text" class="content" @click="updateHitokoto">
        <span class="text">{{ hitokotoData.sentences[hitokotoData.current].text }}</span>
        <span class="from">-「&nbsp;{{ hitokotoData.sentences[hitokotoData.current].from }}&nbsp;」</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { MusicMenu, Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce.js";

const store = mainStore();

// 開啟音樂面板按鈕顯隱
const openMusicShow = ref(false);

// 句子數據
const hitokotoData = reactive({
  sentences: [
    { text: "您的第一句話", from: "來源1" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    { text: "您的第二句話", from: "來源2" },
    // 在這裡添加更多句子
  ],
  current: 0, // 當前顯示的句子索引
});

// 更新句子数据
const updateHitokoto = () => {
  debounce(() => {
    hitokotoData.current = Math.floor(Math.random() * hitokotoData.sentences.length);
  }, 500);
};

onMounted(() => {
  updateHitokoto();
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  .open-music {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000026;
    padding: 4px 0;
    border-radius: 8px 8px 0 0;
    .i-icon {
      width: 18px;
      height: 18px;
      display: block;
      margin-right: 8px;
    }
    span {
      font-size: 0.95rem;
    }
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .text {
      font-size: 1.1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .from {
      margin-top: 10px;
      font-weight: bold;
      align-self: flex-end;
      font-size: 1.1rem;
    }
  }
}
</style>
