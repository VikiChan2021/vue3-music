<template>
  <div class="top-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      class="top-list-content"
    >
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.name"
          @click="toTopListDetail(item)"
        >
          <div class="icon">
            <div class="title">{{ item.name }}</div>
          </div>
          <ul class="song-list">
            <li
              class="song"
              v-for="(song, index) in item.tracks"
              :key="song.id"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.name }}-{{ song.ar[0].name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </van-list>
  </div>
  <router-view></router-view>
</template>

<script>
import { List } from "vant";
import request from "@/utils/request";
import { TOP_LIST_KEY } from "@/assets/js/constant";

export default {
  name: "MyTopList",
  components: {
    "van-list": List,
  },
  data() {
    return {
      topList: [],
      loading: false,
      finished: false,
    };
  },
  async created() {
    const rankId = [19723756, 3779629, 2884035];
    const rankList = [];
    const rankListFull = [];
    for (let i = 0; i < rankId.length; i++) {
      const topListData = await request("/playlist/detail", { id: rankId[i] });
      const rankObj = {
        id: rankId[i],
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3),
      };
      const rankObjFull = {
        id: rankId[i],
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks,
      };
      rankList.push(rankObj);
      rankListFull.push(rankObjFull);
      // 每次循环都更新一次数据,以防长时间白屏
      this.topList = rankList;
      this.loading = false;
    }
    if (this.topList.length > 2) {
      localStorage.setItem(TOP_LIST_KEY, JSON.stringify(rankListFull));
      this.finished = true;
    }
  },
  methods: {
    toTopListDetail(item) {
      this.$router.push({
        path: `/top-list/${item.id}`,
      });
      // TODO:1.把playList变成相应的榜单
      // TODO:2.添加查看当前歌单和喜爱歌单的功能
      console.log("newPlayList", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        position: relative;
        background: $color-dialog-background;
        color: $color-theme;
        .title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: $font-size-large-x;
          font-weight: bold;

          width: 100px;
          text-align: center;
        }
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-medium-x;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
