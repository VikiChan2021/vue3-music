<template>
  <div class="wrapper">
    <div>
      <i class="icon-back" @click="backToTopList"></i>
      <div class="title">{{ currentTopListObj.name }}</div>
    </div>

    <van-list class="listScroll">
      <div
        class="listScrollItem"
        v-for="(item, index) in currentTopListObj.tracks"
        :key="item.name"
        :id="index"
        @click="showMyPlayer"
      >
        <img v-lazy="item.al.picUrl" alt="album" />
        <div class="musicInfo">
          <span class="musicName">{{ item.name }}</span>
          <span class="singer">{{ item.ar[0].name }}</span>
        </div>
        <span class="iconfont icon-bofang"></span>
      </div>
    </van-list>
  </div>
</template>

<script>
import { List } from "vant";
import { TOP_LIST_KEY } from "@/assets/js/constant";
import MyPlayer from "@/components/player/MyPlayer";

export default {
  name: "topListDetail",
  components: {
    MyPlayer,
    "van-list": List,
  },
  data() {
    return {
      currentTopListObj: null,
    };
  },
  methods: {
    backToTopList() {
      this.$router.push("/top-list");
    },
    showMyPlayer(event) {
      this.$store.commit("setFullScreen", true);
      this.$store.commit("setCurrentIndex", event.currentTarget.id);
    },
  },
  created() {
    const topListId = this.$route.params.id;
    const topListFull = JSON.parse(localStorage.getItem(TOP_LIST_KEY));
    this.currentTopListObj = topListFull.find((item) => item.id == topListId);
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;
  .icon-back {
    position: absolute;
    top: 20rem;
    left: 7rem;
    font-size: $font-size-large-x;
    color: #fff;
  }
  .title {
    width: 100%;
    height: 200rem;
    text-align: center;
    line-height: 200rem;
    font-size: $font-size-large-x * 2;
    font-weight: bold;

    background: $color-dialog-background;
    color: $color-theme;
  }
}

.listScroll {
  width: 100%;
  height: calc(100vh - 200rem);
  overflow: scroll;
  margin-top: 30rem;
}
.listScroll .listScrollItem {
  display: flex;
  width: 100%;
  height: 80rem;
  line-height: 80rem;
  margin-bottom: 20rem;
  padding: 0 20rem;
  //加了border-box后, x轴方向不再有滚动条
  box-sizing: border-box;
}
.listScroll .listScrollItem img {
  width: 80rem;
  height: 80rem;
  padding-right: 30rem;
}
.listScroll .listScrollItem .musicInfo {
  flex: 1;

  display: flex;
  flex-direction: column;
}
.listScroll .listScrollItem .musicInfo span {
  height: 40rem;
  line-height: 40rem;
  font-size: 24rem;

  max-width: 300rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.listScroll .listScrollItem .musicInfo .singer {
  font-size: 20rem;
  color: rgba(0, 0, 0, 0.8);
}
.listScroll .listScrollItem .iconfont {
  line-height: 80rem;
  font-size: 40rem;
}
</style>
