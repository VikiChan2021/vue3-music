import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入全局样式
import "@/assets/scss/index.scss";

import { Lazyload } from "vant";

const app = createApp(App);
app.use(store).use(router).use(Lazyload);
app.mount("#app");
