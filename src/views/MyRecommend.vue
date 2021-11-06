<template>
  <div class="recommendWrapper">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="b in bannerList" :key="b.bannerId">
        <img :src="b.pic" alt="banner" />
      </van-swipe-item>
    </van-swipe>

    <MyPlayer />

    <van-list
      class="listScroll"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="listScrollItem"
        v-for="(item, index) in list"
        :key="item.name"
        @click="showMyPlayer"
        :id="index"
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
import { ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { Swipe, SwipeItem, List } from "vant";
import request from "@/utils/request";

const MyPlayer = defineAsyncComponent(() =>
  import("@/components/player/MyPlayer")
);

export default {
  name: "MyRecommend",
  components: {
    MyPlayer,
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-list": List,
  },
  data() {
    return {
      bannerList: [],
      topList: [],
    };
  },
  async created() {
    const bannerListData = await request("/banner", { type: 2 });
    this.bannerList = bannerListData.banners;
  },
  setup() {
    const store = useStore();
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const onLoad = async () => {
      loading.value = true;
      const topListData = await request("/playlist/detail", { id: 19723756 });
      list.value = topListData.playlist.tracks.slice(0, 60);
      loading.value = false;
      if (list.value.length >= 40) {
        finished.value = true;
      }
      store.commit("setPlaylist", list.value);
      store.commit("setSequenceList", list.value);
    };
    const showMyPlayer = (event) => {
      store.commit("setFullScreen", true);
      store.commit("setCurrentIndex", event.currentTarget.id);
    };

    return {
      list,
      loading,
      finished,
      onLoad,
      showMyPlayer,
    };
  },
};
</script>

<style lang="scss" scoped>
.recommendWrapper {
  width: 100%;
}

.my-swipe .van-swipe-item img {
  width: 100%;
}

.listScroll {
  width: 100%;
  height: calc(100vh - 245rem);
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

  max-width: 500rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.listScroll .listScrollItem .musicInfo .singer {
  font-size: 20rem;
  color: rgba(0, 0, 0, 0.8);
}
.listScroll .listScrollItem .iconfont {
  width: 80rem;
  line-height: 80rem;
  font-size: 40rem;
}
</style>
