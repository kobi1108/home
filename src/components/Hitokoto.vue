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
        <span>打開音樂播放器（開發中）</span>
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
    { text: "秒速5厘米，那是櫻花飄落的速度，那麼怎樣的速度，才能走完我與你之間的距離？", from: "秒速五厘米/櫻花抄" },
    { text: "可是就算我們通一千次短訊，我們各自的心，大概也只會相互靠近一厘米吧。", from: "秒速五厘米/秒速五厘米" },
    { text: "時光滿懷惡意的從我頭上緩緩流過，讓我覺得每一分鐘都是如此漫長。", from: "秒速五厘米/櫻花抄" },
    { text: "誰都不可能和誰在一起一輩子。人就是這樣，必須去習慣失去。", from: "秒速五厘米/太空人" },
    { text: "而我們又將去向何方，又能到達何處呢？", from: "秒速五厘米/太空人" },
    { text: "光是看著藍天，就會覺得活著真好，令人更想要疼愛身邊的人。", from: "天氣之子" },
    { text: "人心是與天空串聯在一起的。", from: "天氣之子" },
    { text: "年輕人，這世界本來就是瘋狂的，儘管去做你認為正確的事吧！", from: "天氣之子" },
    { text: "你就一直那樣，總對重要的事隻字不提。然後擺出若無其事的表情，一直孤單一人度過一生吧！", from: "言葉之庭" },
    { text: "隱約雷鳴，陰霾天空，但盼風雨來，能留你在此。", from: "言葉之庭" },
    { text: "隱約雷鳴，陰霾天空，若汝願相留，即使天無雨，我亦留此地。", from: "言葉之庭" },
    { text: "即使再悲傷也要勇敢活下去，這是人類的詛咒，但一定，也是一種祝福。", from: "追逐繁星的孩子" },
    { text: "生死門雖繁星燦爛，但活著的人才是最重要。", from: "追逐繁星的孩子" },
    { text: "也許我所失去的，正是我生命中絕不該放手的東西。", from: "雲之彼端，約定的地方" },
    { text: "天空的含義是浩瀚，雲的含義是漂泊無定，荒涼的小鎮是內心的孤獨。", from: "雲之彼端，約定的地方" },
    { text: "伸手可見的距離，卻不能到達的那個地方。", from: "雲之彼端，約定的地方" },
    { text: "也許，思念可以超越時間與距離。", from: "星之聲" },
    { text: "什麼時候我們開始無法像孩子一樣肆意地大呼小叫了？", from: "龍貓" },
    { text: "心裡的小情緒堆積得像山一樣高，直到溢出來。與其如此，不如永遠像孩子一樣。", from: "龍貓" },
    { text: "人生就是一列開往墳墓的列車，路途上會有很多站，很難有人可以至始至終陪著走完。", from: "千與千尋" },
    { text: "千萬不可以丟失自我。", from: "千與千尋" },
    { text: "世界那麼大，人生那麼長，總會有這麼一個人，讓你想要溫柔的對待。", from: "哈爾移動城堡" },
    { text: "我們的孤獨就像天空中漂浮的城市，彷彿是一個秘密，卻無從述說。", from: "天空之城" },
    { text: "越是試著忘記，越是記得深刻。", from: "天空之城" },
    { text: "我想以沒有仇恨的眼晴看世界。不管曾經傷害被多深，總會有人出現讓你原諒生活對你的刁難。", from: "幽靈公主" },
    { text: "成長是一筆交易，我們都是用樸素的童真與未經人事的潔白交換長大的勇氣。", from: "魔女宅急便" },
    { text: "堅強不是面對悲傷不流一滴淚，而是擦乾眼淚後微笑面對以後的生活。", from: "風之谷" },
    { text: "不管前方的路有多苦，只要走的方向正確，不管多麼崎嶇不平，都比站在原地更幸福。", from: "千與千尋" },
    { text: "曾經發生過的事情不可能忘記，只不過是想不起而已。", from: "千與千尋" },
    { text: "你可以碰到「機遇」但絕不可能碰到「神」，自己的路，還是得自己走。", from: "千與千尋" },
    { text: "不要這麼在乎外表嘛，重要的是妳的心靈！", from: "魔女宅急便" },
    { text: "就算變成大人了，奇蹟還是會發生。", from: "魔女宅急便" },
    { text: "有雨傘好棒，可是雨傘在流淚。", from: "龍貓" },
    { text: "再沒有什麼比幸福的回憶更妨礙幸福的了。", from: "風起了" },
    { text: "生命中最艱難的那段路是自己一個人走過來的，這樣學到更多的是堅強，而不是感動。", from: "紅豬" },
    { text: "我不知道去哪裡，但我一直在路上。", from: "千與千尋" },
    { text: "生命可以隨心所欲，但不能隨波逐流。", from: "貓之報恩" },
    { text: "即使疾風襲來，人生不輕言敗。風起了，唯有努力生存。", from: "風起了" },
    { text: "世上有些問題即使有了答案也無法輕易回答。", from: "狼與香辛料" },
    { text: "與其因為懷疑而後悔，倒不如因為信任而後悔。", from: "刀劍神域" },
    { text: "有資格開槍的人，只有有著被射殺覺悟的人", from: "Code Geass 反叛的魯路修" },
    { text: "什麼都無法捨棄的人，什麼都改變不了。", from: "進擊的巨人" },
    { text: "都怪你們我的心越來越不純潔了……", from: "銀魂" },
    { text: "能原諒女人謊言的才是真正的男人。", from: "海賊王" },
    { text: "有些煩惱，丟掉了，才有雲淡風輕的機會。", from: "龍貓" },
    { text: "超越可能，突破世間常理的就是我們紅蓮團！", from: "天元突破" },
    { text: "假說是為了被證明而存在的。", from: "蒼藍鋼鐵戰艦" },
    { text: "要創造出能夠震撼人心的作品，首先要震撼到自己。", from: "櫻花莊的寵物女孩" },
    { text: "倘若把自己準備不足當作藉口而錯失了眼前的機會，就絕不會再有下一次機會。", from: "櫻花莊的寵物女孩" },
    { text: "這個世界是不存在什麼運氣的。", from: "NO GAME NO LIFE 遊戲人生" },
    { text: "要挑戰神的人， 怎麼可能理智。", from: "NO GAME NO LIFE 遊戲人生" },
    { text: "會被人盯上是有能力的象徵。", from: "暗殺教室" },
    { text: "俗話說不恥下問是一時之恥，恥而不問則是一生之恥。", from: "SHIROBAKO白箱" },
    { text: "教別人的即是教自己，落實到語言說出來會有新的理解。", from: "SHIROBAKO白箱" },
    { text: "不管是誰都會失敗，既然如此那就盡力不要讓失敗重演就好。", from: "OVERLORD" },
    { text: "看啊，人就像垃圾一樣！", from: "天空之城" },
    { text: "放棄的話，比賽就真的結束了。", from: "灌籃高手" },
    { text: "我很在意！", from: "冰菓" },
    { text: "你們這些家伙，這也算是在追銀魂嗎！", from: "銀魂" },
    { text: "總是以自己的目地為先的話，對方會不高興的唷。", from: "Re:從零開始的異世界生活" },
    { text: "俗話說虛構有時也是現實的反應。", from: "涼宮春日" },
    { text: "既然有時間在最後壯烈犧牲，不如完美地活到最後一刻。", from: "銀魂" },
    { text: "真相永遠只有一個！", from: "名探偵柯南" },
    { text: "不能逃避。不能逃避。不能逃避。", from: "新世紀福音戰士/碇真嗣" },
    { text: "因為他只是個小鬼。", from: "機動戰士鋼彈" },
    { text: "你不會死的，因為我會保護你。", from: "新世紀福音戰士/綾波零" },
    { text: "我是為了與你相遇而活著的...", from: "新世紀福音戰士/渚薰" },
    { text: "只要微笑就可以了。", from: "新世紀福音戰士/碇真嗣" },
    { text: "你是白痴嗎？", from: "新世紀福音戰士/明日香" },
    { text: "所謂的奇蹟，要真的發生才有價值。", from: "新世紀福音戰士/葛誠美里" },
    { text: "人類因為畏懼黑暗，所以用火消除黑暗以求生存。", from: "新世紀福音戰士/綾波零" },
    { text: "我是說，我喜歡你。", from: "新世紀福音戰士/渚薰" },
    { text: "不能逃避。", from: "新世紀福音戰士/碇真嗣" },
    { text: "如果碇司令讓你死你也死嗎？", from: "新世紀福音戰士/明日香" },
    { text: "進化的終點就是死亡。", from: "新世紀福音戰士/赤木律子" },
    { text: "人類的敵人，最終還是人類。", from: "新世紀福音戰士/碇源堂" },
    { text: "晚安，是什麼？是讓大家安心睡覺的話。 ", from: "新世紀福音戰士終/綾波零+村民" },
    { text: "什麽是早安？是祝彼此擁有美好一天的話。", from: "新世紀福音戰士終/綾波零+村民" },
    { text: "什麽是再見？是希望彼此再次相見時說的話。", from: "新世紀福音戰士終/綾波零+村民" },
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
