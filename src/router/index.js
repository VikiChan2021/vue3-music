import { createRouter, createWebHashHistory } from "vue-router";
import MyRecommend from "@/views/MyRecommend";
import MyVideo from "@/views/MyVideo";
import MyTopList from "@/views/MyTopList";
import MySearch from "@/views/MySearch";
import topListDetail from "@/views/topListDetail";
import MyLogin from "@/components/login/MyLogin";

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
      path: "/video",
      component: MyVideo,
    },
    {
      path: "/top-list",
      component: MyTopList,
      children: [
        {
          path: ":id",
          component: topListDetail,
        },
      ],
    },
    {
      path: "/search",
      component: MySearch,
    },
    {
      path: "/user",
      component: MyLogin,
    },
  ],
});
