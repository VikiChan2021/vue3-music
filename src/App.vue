<template>
  <MyHeader />
  <MyTab />
  <router-view></router-view>
</template>

<script>
import MyHeader from "@/components/header/MyHeader";
import MyTab from "@/components/tab/MyTab";

export default {
  name: "App",
  components: { MyHeader, MyTab },
};
</script>

<style lang="scss"></style>
