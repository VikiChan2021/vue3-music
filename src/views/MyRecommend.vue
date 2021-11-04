<template>
  <div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="b in bannerList" :key="b.bannerId">
        <img :src="b.pic" alt="banner" />
      </van-swipe-item>
    </van-swipe>

    <van-list
      class="listScroll"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="listScrollItem" v-for="item in list" :key="item.name">
        <img v-lazy="item.al.picUrl" alt="album" />
        <view class="musicInfo">
          <text class="musicName">{{ item.name }}</text>
          <text class="singer">{{ item.ar[0].name }}</text>
        </view>
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
.my-swipe .van-swipe-item img {
  width: 100%;
}

.listScroll {
  width: 100%;
  height: calc(100vh - 245px);
  overflow: scroll;
}
.listScroll .listScrollItem {
  display: flex;
  width: 100%;
  height: 80px;
  line-height: 80px;
  margin-bottom: 20px;
}
.listScroll .listScrollItem image {
  width: 80px;
  height: 80px;
  padding-right: 30px;
}
.listScroll .listScrollItem .musicInfo {
  flex: 1;

  display: flex;
  flex-direction: column;
}
.listScroll .listScrollItem .musicInfo text {
  height: 40px;
  line-height: 40px;
  font-size: 24px;

  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.listScroll .listScrollItem .iconfont {
  width: 80px;
  text-align: right;
}
</style>
