<template>
  <div class="listScroll">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="b in bannerList" :key="b.bannerId">
        <img :src="b.pic" alt="banner" />
      </van-swipe-item>
    </van-swipe>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
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

    // 排行榜数据
    const rankId = [19723756, 3779629, 2884035];
    let rankList = [];
    for (let i = 0; i < rankId.length; i++) {
      const topListData = await request("/playlist/detail", { id: rankId[i] });
      const rankArr = topListData.playlist.tracks.slice(0, 10);
      rankList = rankList.concat(rankArr);
      // 每次循环都更新一次数据,以防长时间白屏
      this.topList = rankList;
    }

    console.log(this.$data);
  },
  setup() {
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);

    const onLoad = () => {
      setTimeout(() => {
        if (refreshing.value) {
          list.value = [];
          refreshing.value = false;
        }

        for (let i = 0; i < 10; i++) {
          list.value.push(list.value.length + 1);
        }
        loading.value = false;

        if (list.value.length >= 40) {
          finished.value = true;
        }
      }, 1000);
    };

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };

    return {
      list,
      onLoad,
      loading,
      finished,
      onRefresh,
      refreshing,
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
  height: 600px;
  overflow: scroll;
}
</style>
