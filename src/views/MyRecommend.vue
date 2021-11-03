<template>
  <div>MyRecommend</div>
</template>

<script>
import { getTopBanner } from "@/services/recommend";

export default {
  name: "MyRecommend",
  async created() {
    const getTopBannerData = await getTopBanner("/banner");
    console.log(getTopBannerData);
  },
};
</script>

<style lang="scss" scoped></style>
