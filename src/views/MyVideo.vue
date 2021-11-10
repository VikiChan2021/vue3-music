<template>
  <div v-if="isLogin" class="videoContainer">
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
      v-if="isLoadingNextTab"
      vertical
      style="font-size: 50rem; margin-top: 150rem"
      color="#d43c33"
    >
      新的视频即将到来...
    </van-loading>
    <van-pull-refresh
      v-else
      v-model="isPullingRefresh"
      @refresh="handleRefresher"
      loading-text="下拉刷新中!!!"
    >
      <van-list
        class="videoScroll"
        v-model:loading="isLoadingCurrentList"
        loading-text="莫慌,加载中!!!"
        @load="handleToLower"
        :immediate-check="false"
      >
        <div
          class="videoScrollItem"
          v-for="item in videoList"
          :key="item.data.vid"
        >
          <video
            @click="handlePlay"
            :src="item.data.urlInfo"
            controls
            :poster="item.data.coverUrl"
            :id="item.data.vid"
          ></video>

          <div class="content">
            {{ item.data.title }}
          </div>
          <div class="footer">
            <img
              class="avatar"
              :src="item.data.creator.avatarUrl"
              alt="avatar"
            />
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
      </van-list>
    </van-pull-refresh>
  </div>
  <div v-else class="goToLogin">
    <van-button
      round
      type="primary"
      color="#d43c33"
      class="toLoginBtn"
      @click="toLogin"
    >
      点我登录
    </van-button>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Tab, Tabs, Loading, PullRefresh, List, Button, Toast } from "vant";
import { COOKIE_KEY } from "@/assets/js/constant";

export default {
  name: "MyVideo",
  components: {
    "van-tabs": Tabs,
    "van-tab": Tab,
    "van-loading": Loading,
    "van-pull-refresh": PullRefresh,
    "van-list": List,
    "van-button": Button,
  },
  data() {
    return {
      videoGroupList: [],
      navId: "",
      videoList: [],
      videoId: "",
      videoTimeUpdateList: [],
      isPullingRefresh: false, // 是否正在下拉刷新
      offset: 1, // 加载第几页的数据
      active: 0,
      isLoadingNextTab: false,
      isLoadingCurrentList: false,
      isLogin: false,
    };
  },
  activated() {
    this.isLogin = !!localStorage.getItem(COOKIE_KEY);
    console.log("activated", "检查是否登录了");
    this.getVideoListData(this.navId, this.offset);
  },
  created() {
    this.getVideoGroupListData();
  },
  watch: {
    navId(newValue) {
      this.offset = 1;
      this.videoList = [];
      this.isLoadingNextTab = true;
      this.getVideoListData(newValue, this.offset);
    },
  },
  methods: {
    toLogin() {
      this.$router.push("/user");
    },
    changeNav(event) {
      this.navId = event.name;
    },

    async getVideoGroupListData() {
      const videoGroupListData = await request("/video/group/list");
      this.videoGroupList = videoGroupListData.data.slice(0, 14);
      this.navId = videoGroupListData.data[0].id || "58100";
    },
    async getVideoListData(navId, offset = 1, type = "") {
      if (!navId) {
        navId = "58100";
      }
      const videoListData = await request("/video/group", {
        id: navId,
        offset,
      });
      // videoListData.datas是一个数组,但里面的对象没有播放的url,
      // 所以此处是让每个对象加上urlInfo这个属性
      for (let item of videoListData.datas) {
        const videoId = item.data.vid;
        // 不让重复的视频出现在列表中
        const index = this.videoList.findIndex(
          (oldItem) => oldItem.data.vid === videoId
        );
        if (index > -1) {
          continue;
        }

        item.data.urlInfo = await request("/video/url", { id: videoId }).then(
          (obj) => obj.urls[0].url
        );
        Toast({
          message: `拿到本视频的url了--方式1--${item.data.urlInfo}`,
          duration: 5000,
        });
        if (!type) {
          this.videoList.push(item);
          console.log("此次新push的视频ID", item.data.vid);
        } else if (type === "refresh") {
          this.videoList.unshift(item);
          console.log("此次新unshift的视频ID", item.data.vid);
        }
        this.isLoadingNextTab = false;
        this.isPullingRefresh = false;
        this.isLoadingCurrentList = false;
        this.offset = offset + 1;
      }
    },
    handlePlay(event) {
      console.log(event.target);
    },
    handleRefresher() {
      this.getVideoListData(this.navId, this.offset, "refresh");
    },
    handleToLower() {
      this.getVideoListData(this.navId, this.offset);
    },
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

.goToLogin {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  .toLoginBtn {
    font-size: $font-size-large-x !important;
  }
}

//:root {
//  --van-list-text-color: #d43c33;
//}
</style>
