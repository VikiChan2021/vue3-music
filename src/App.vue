<template>
  <MyHeader />
  <MyTab />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <MyPlayer />
</template>

<script>
import MyHeader from "@/components/header/MyHeader";
import MyTab from "@/components/tab/MyTab";
import MyPlayer from "@/components/player/MyPlayer";

export default {
  name: "App",
  components: { MyPlayer, MyHeader, MyTab },
};
</script>

<style lang="scss"></style>
