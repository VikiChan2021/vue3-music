<template>
  <div class="player" v-if="playlist.length">
    <transition>
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="currentSong" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">
            {{ currentSong.ar[0].name }}
          </h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd" :class="rotateCls">
                <img
                  ref="cdImageRef"
                  class="image"
                  :src="currentSong.al.picUrl"
                  alt="song"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :progress="progress"
                @progressChanging="handleProgressChanging"
                @progressChanged="handleProgressChanged"
              />
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.dt / 1000)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer />
    <audio
      ref="audioRef"
      @timeupdate="handleTimeupdate"
      @ended="handleEnded"
      @pause="handlePause"
    ></audio>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import request from "@/utils/request";
import useMode from "@/components/player/useMode";
import useFavorite from "@/components/player/useFavorite";
import ProgressBar from "@/components/player/ProgressBar";
import { formatTime } from "@/assets/js/util";
import MiniPlayer from "@/components/player/MiniPlayer";
import { Toast } from "vant";

export default {
  name: "MyPlayer",
  components: { MiniPlayer, ProgressBar, Toast },
  setup() {
    // data
    const audioRef = ref(null);
    const currentTime = ref(0); // 歌曲正播放到第几秒
    const isProgressChanging = ref(false); // 进度条是否正在被拖动

    // vuex
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const playlist = computed(() => store.state.playlist);
    const currentSong = computed(() => store.getters.currentSong);
    const currentIndex = computed(() => store.state.currentIndex);
    const playing = computed(() => store.state.playing);

    // hooks
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    // computed
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });

    // watch
    watch(playing, (newPlaying) => {
      newPlaying ? audioRef.value.play() : audioRef.value.pause();
    });
    watch(currentSong, async (newSong) => {
      store.commit("setPlayingState", false);
      if (audioRef.value) {
        audioRef.value.currentTime = 0;
      } else {
        return;
      }

      const songData = await request("/song/url", {
        id: newSong.id,
      });
      if (songData.data[0].url) {
        audioRef.value.src = songData.data[0].url;
        // Toast({
        //   message: `拿到本歌曲的url了--方式1--${audioRef.value?.src}`,
        //   duration: 5000,
        // });
      } else {
        audioRef.value.src = `https://music.163.com/song/media/outer/url?id=${newSong.id}.mp3`;
        // Toast({
        //   message: `拿到本歌曲的url了--方式2--${audioRef.value?.src}`,
        //   duration: 5000,
        // });
      }
      store.commit("setPlayingState", true);
    });

    // methods
    const goBack = () => {
      store.commit("setFullScreen", false);
    };
    const togglePlay = () => {
      store.commit("setPlayingState", !playing.value);
    };
    const prevSong = () => {
      store.commit("setPlayingState", false);
      audioRef.value.currentTime = 0;

      let index = currentIndex.value;
      index--;
      if (index < 0) {
        index = playlist.value.length - 1;
      }
      // 单曲循环
      if (modeIcon.value === "icon-loop") {
        index = currentIndex.value;
      }
      store.commit("setCurrentIndex", index);
      store.commit("setPlayingState", true);
    };
    const nextSong = () => {
      store.commit("setPlayingState", false);
      audioRef.value.currentTime = 0;

      let index = currentIndex.value;
      index++;
      if (index > playlist.value.length - 1) {
        index = 0;
      }
      // 单曲循环
      if (modeIcon.value === "icon-loop") {
        index = currentIndex.value;
      }
      store.commit("setCurrentIndex", index);
      store.commit("setPlayingState", true);
    };

    // audioRef.value.currentTime --> currentTime --> progress --> audioRef.value.currentTime
    const handleTimeupdate = (event) => {
      // 每分每秒都对data中的currentTime进行更新,但进度条被拖动时不更新
      if (isProgressChanging.value) return;
      currentTime.value = event.target.currentTime;
    };
    const progress = computed(() => {
      return currentTime.value / (currentSong.value.dt / 1000);
    });
    // 自定义事件'progressChanging',在子组件emit后,父组件监听到后,执行该回调
    const handleProgressChanging = (newProgress) => {
      isProgressChanging.value = true;
      // 拖动时音频不变,只是显示的时长变
      currentTime.value = newProgress * (currentSong.value.dt / 1000);
    };
    const handleProgressChanged = (newProgress) => {
      isProgressChanging.value = false;
      // 拖动结束后,音频和显示的时长都要变
      audioRef.value.currentTime = newProgress * (currentSong.value.dt / 1000);
    };
    const handleEnded = () => {
      nextSong();
    };
    const handlePause = () => {
      console.log("被意外暂停播放了");
      store.commit("setPlayingState", false);
    };

    const rotateCls = computed(() => (playing.value ? "rotating" : ""));

    return {
      fullScreen,
      currentSong,
      playlist,
      audioRef,
      playIcon,
      goBack,
      togglePlay,
      prevSong,
      nextSong,
      // 切换播放模式
      modeIcon,
      changeMode,
      // 添加到喜爱列表
      getFavoriteIcon,
      toggleFavorite,
      // 展示进度条
      currentTime,
      handleTimeupdate,
      formatTime,
      progress,
      // 拖动进度条
      handleProgressChanging,
      handleProgressChanged,
      // 播放结束后自动下一首
      handleEnded,
      rotateCls,
      handlePause,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
          }
          .rotating {
            animation: rotate 20s linear infinite;
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
