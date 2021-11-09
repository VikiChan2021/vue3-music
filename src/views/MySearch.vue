<template>
  <div class="searchContainer">
    <div class="header">
      <span class="iconfont icon-search1"></span>
      <input
        type="text"
        :placeholder="placeholderContent"
        @input="handleInput"
        :value="searchContent"
      />
      <span class="cancel" @click="handleClear">取消</span>
    </div>

    <template v-if="searchContent">
      <div class="showSearchContent">
        <div class="searchContent">搜索内容:{{ searchContent }}</div>
        <div class="searchResultList">
          <div
            class="searchResultListItem"
            v-for="item in searchResultList"
            :key="item.id"
          >
            <span class="iconfont icon-search1"></span>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="history" v-if="searchHistoryList.length">
        <div class="title">历史:</div>
        <div class="historyItem" v-for="item in searchHistoryList" :key="item">
          {{ item }}
        </div>
        <div
          class="iconfont icon-shanchu delete"
          @click="deleteSearchHistory"
        ></div>
      </div>

      <van-loading
        v-if="isLoadingHotList"
        vertical
        style="font-size: 50rem; margin-top: 150rem"
        color="#d43c33"
      >
        热搜榜即将到来...
      </van-loading>
      <div class="hotContainer" v-else>
        <div class="title">热搜榜</div>
        <div class="hotList">
          <div
            class="hotListItem"
            v-for="(item, index) in hotList"
            :key="item.content"
          >
            <span class="order">{{ index + 1 }}</span>
            <span class="name">{{ item.searchWord }}</span>
            <img
              v-if="item.iconUrl"
              class="iconImg"
              :src="item.iconUrl"
              alt="icon"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import request from "@/utils/request";
import { SEARCH_HISTORY_LIST_KEY } from "@/assets/js/constant";
import { Loading } from "vant";

let timer;
export default {
  name: "MySearch",
  components: {
    "van-loading": Loading,
  },
  data() {
    return {
      placeholderContent: "",
      hotList: [],
      searchContent: "",
      searchResultList: [],
      searchHistoryList: [],
      isLoadingHotList: false,
    };
  },
  mounted() {
    this.getInitData();
    this.getSearchHistoryList();
  },
  methods: {
    async getInitData() {
      this.isLoadingHotList = true;
      const placeholderContentData = await request("/search/default");
      const hotListData = await request("/search/hot/detail");

      this.placeholderContent = placeholderContentData.data.showKeyword;
      this.hotList = hotListData.data;
      this.isLoadingHotList = false;
    },

    getSearchHistoryList() {
      const list = localStorage.getItem(SEARCH_HISTORY_LIST_KEY);
      if (!list) return;
      this.searchHistoryList = JSON.parse(list);
    },

    handleClear() {
      this.searchContent = "";
    },
    deleteSearchHistory() {
      this.searchHistoryList = [];
      localStorage.removeItem(SEARCH_HISTORY_LIST_KEY);
    },

    handleInput(event) {
      const searchContent = event.target.value;
      console.log("searchContent", searchContent);
      if (!searchContent) {
        this.searchContent = "";
        // console.log("this.setData");
        return;
      }
      let searchResultListData;

      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        searchResultListData = await request("/search", {
          keywords: searchContent,
          limit: 10,
        });
        this.searchContent = searchContent;
        this.searchResultList = searchResultListData.result.songs;
        // 把搜索历史保存到本地
        const { searchHistoryList } = this;
        const index = searchHistoryList.findIndex(
          (item) => item == searchContent
        );
        if (index > -1) {
          searchHistoryList.splice(index, 1);
        }
        searchHistoryList.unshift(searchContent);

        this.searchHistoryList = searchHistoryList;
        localStorage.setItem(
          SEARCH_HISTORY_LIST_KEY,
          JSON.stringify(searchHistoryList)
        );
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.searchContainer {
  padding: 10rem 20rem;
  font-size: $font-size-large;
}
.searchContainer .header {
  position: relative;
  display: flex;
  align-items: center;
  height: 80rem;
}
.searchContainer .header .icon-search1 {
  position: absolute;
  left: 25rem;
  font-size: 30rem;
}
.searchContainer .header input {
  flex: 1;
  margin-right: 30rem;
  padding-left: 80rem;

  border: 1px solid #000;
  border-radius: 10rem;
  background: #eee;

  height: 40rem;
}
.searchContainer .header .clear {
  position: absolute;
  right: 150rem;
  z-index: 99;
}
.searchContainer .header .cancel {
  width: 60rem;
}
.searchPlaceholder {
  color: #d43c33;
}

.hotContainer .title {
  margin: 20rem 0;
}
.hotContainer .hotList {
  display: flex;
  flex-wrap: wrap;
}
.hotContainer .hotList .hotListItem {
  display: flex;

  width: 50%;
  margin-bottom: 20rem;
  box-sizing: border-box;
  font-size: 22rem;

  //height: 30rem;
  //line-height: 30rem;
}
.hotContainer .hotList .hotListItem .order {
  width: 30rem;
  text-align: center;
  margin: 0 10rem;
}
.hotContainer .hotList .hotListItem .name {
  max-width: 200rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hotContainer .hotList .hotListItem .iconImg {
  width: 25rem;
  height: 20rem;
  margin-left: 10rem;
}

.showSearchContent .searchContent {
  height: 80rem;
  line-height: 80rem;
  color: #d43c33;
  border-bottom: 1px solid #d43c33;
}
.showSearchContent .searchResultList .searchResultListItem {
  height: 60rem;
  line-height: 60rem;
}
.showSearchContent .searchResultList .searchResultListItem .icon-search1 {
  position: relative;
  top: -12rem;
  margin: 0 20rem;
}
.showSearchContent .searchResultList .searchResultListItem .name {
  display: inline-block;
  max-width: 600rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: 10rem 0 10rem 0;
  font-size: $font-size-large;
}
.history .title {
  margin-right: 20rem;
  height: 30rem;
  line-height: 30rem;
}
.history .historyItem {
  height: 30rem;
  line-height: 30rem;

  margin: 0 20rem 10rem 0;
  background: #eee;
  border-radius: 10rem;
  padding: 5rem 10rem;
}
.history .delete {
  position: absolute;
  right: 30rem;
  bottom: 20rem;
  font-size: $font-size-large-x;
  /* height: 50rem;
  line-height: 50rem; */
}
</style>
