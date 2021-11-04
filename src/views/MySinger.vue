<template>
  <div class="videoContainer">
    <van-tabs class="navScroll" @click-tab="changeNav">
      <van-tab
        class="navScrollItem"
        v-for="item in videoGroupList"
        :key="item.name"
        :title="item.name"
        :name="item.id"
      >
      </van-tab>
    </van-tabs>

    <van-loading
      v-if="isLoading"
      vertical
      style="font-size: 50rem; margin-top: 150rem"
    >
      加载中...
    </van-loading>

    <div v-else class="videoScroll">
      <div
        class="videoScrollItem"
        v-for="item in videoList"
        :key="item.data.vid"
      >
        <video :src="item.data.urlInfo" controls></video>
        <div class="content">
          {{ item.data.title }}
        </div>
        <div class="footer">
          <img class="avatar" :src="item.data.creator.avatarUrl" />
          <span class="nickName">
            {{ item.data.creator.nickname }}
          </span>
          <div class="comments_praised">
            <span class="item">
              <span class="iconfont icon-buoumaotubiao15"></span>
              <span class="count">
                {{ item.data.praisedCount }}
              </span>
            </span>
            <span class="item">
              <span class="iconfont icon-pinglun1"></span>
              <span class="count">
                {{ item.data.commentCount }}
              </span>
            </span>
            <button class="item btn">
              <span class="iconfont icon-gengduo"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Tab, Tabs, Loading } from "vant";

export default {
  name: "MyVideo",
  components: {
    "van-tabs": Tabs,
    "van-tab": Tab,
    "van-loading": Loading,
  },
  data() {
    return {
      videoGroupList: [],
      navId: "",
      videoList: [],
      videoId: "",
      videoTimeUpdateList: [],
      isTriggered: false,
      offset: 1, // 加载第几页的数据
      active: 0,
      isLoading: false,
    };
  },
  methods: {
    async getVideoGroupListData() {
      const videoGroupListData = await request("/video/group/list");
      this.videoGroupList = videoGroupListData.data.slice(0, 14);
    },
    changeNav(event) {
      console.log(event);
      this.navId = event.name;
      this.videoList = [];
      this.getVideoListData(event.name, 1);
    },
    async getVideoListData(navId, offset = 1) {
      this.isLoading = true;
      const videoListData = await request("/video/group", {
        id: navId,
        offset,
      });
      videoListData.datas.forEach(async (item) => {
        const videoId = item.data.vid;
        const urlInfo = await request("/video/url", { id: videoId }).then(
          (obj) => obj.urls[0].url
        );
        // console.log("urlInfo", urlInfo);
        item.data.urlInfo = urlInfo;
      });

      setTimeout(() => {
        let videoList = this.videoList;
        videoList.push(...videoListData.datas);
        this.videoList = videoList;
        this.isLoading = false;
      }, 2000);
    },
  },
  mounted() {
    this.getVideoGroupListData();
    this.getVideoListData("58100", 1);
  },
};
</script>

<style lang="scss" scoped>
.videoScroll {
  width: 100%;
  padding: 0 5%;
  height: calc(100vh - 150rem);
  overflow: scroll;
  margin-top: 30rem;
}
.videoScroll .videoScrollItem {
  width: 90%;
  margin-bottom: 30rem;
}
.videoScroll .videoScrollItem video,
.videoScroll .videoScrollItem img {
  width: 100%;
  //height: 360rem;
  border-radius: 10rem;
}

.videoScrollItem .content {
  font-size: 25rem;
  height: 50rem;
  line-height: 50rem;

  max-width: 500rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer {
  box-sizing: border-box;
  border-top: 1rem solid #eee;
  padding: 5rem 0;
}
.footer .avatar {
  width: 40rem !important;
  height: 40rem !important;
  border-radius: 50% !important;
  vertical-align: middle;
}

.footer .nickName {
  font-size: 20rem;
  vertical-align: middle;
  margin-left: 20rem;
}

.footer .comments_praised {
  float: right;
  height: 40rem;
  line-height: 40rem;
}

.comments_praised .btn {
  display: inline;
  padding: 0;
  background-color: transparent;
  border-color: transparent;
}

.comments_praised .btn:after {
  border: none;
}

.comments_praised .item {
  margin-left: 50rem;
  position: relative;
}

.comments_praised .item .count {
  position: absolute;
  top: -10rem;
  font-size: 10rem;
}
</style>
