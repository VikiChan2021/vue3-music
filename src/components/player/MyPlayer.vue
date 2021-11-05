<template>
  <div class="player" v-show="playlist.length">
    <transition>
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                  alt="song"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom"></div>
      </div>
    </transition>
    <audio></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "MyPlayer",
  setup() {
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);

    return { fullScreen, currentSong };
  },
};
</script>

<style scoped></style>
