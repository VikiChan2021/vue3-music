<template>
  <div class="recommendWrapper">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="b in bannerList" :key="b.bannerId">
        <img :src="b.pic" alt="banner" />
      </van-swipe-item>
    </van-swipe>

    <van-list
      class="listScroll"
      v-model:loading="loading"
      :finished="finished"
      finished-span="没有更多了"
      @load="onLoad"
    >
      <div class="listScrollItem" v-for="item in list" :key="item.name">
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
import request from "@/utils/request";
import { Swipe, SwipeItem, List, PullRefresh, Cell } from "vant";
import { ref } from "vue";

export default {
  name: "MyRecommend",
  components: {
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-list": List,
    "van-pull-refresh": PullRefresh,
    "van-cell": Cell,
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

    console.log(this.$data);
  },
  setup() {
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(async () => {
        // 排行榜数据
        const topListData = await request("/playlist/detail", {
          id: 19723756,
        });
        list.value = topListData.playlist.tracks.slice(0, 50);

        // 加载状态结束
        loading.value = false;

        // 数据全部加载完成
        if (list.value.length >= 40) {
          finished.value = true;
        }
      }, 0);
    };

    return {
      list,
      onLoad,
      loading,
      finished,
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
