import { createRouter, createWebHashHistory } from "vue-router";
import MyRecommend from "@/views/MyRecommend";
import MySinger from "@/views/MySinger";
import MyTopList from "@/views/MyTopList";
import MySearch from "@/views/MySearch";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/recommend",
    },
    {
      path: "/recommend",
      component: MyRecommend,
    },
    {
      path: "/singer",
      component: MySinger,
    },
    {
      path: "/top-list",
      component: MyTopList,
    },
    {
      path: "/search",
      component: MySearch,
    },
  ],
});
