<template>
  <div class="progress-bar" @click="handleProgressJump">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          :style="progressBtnStyle"
          @touchstart.prevent="ontouchstart"
          @touchmove.prevent="ontouchmove"
          @touchend.prevent="ontouchend"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
// 小圆点的宽度
const progressBtnWidth = 16;

export default {
  name: "ProgressBar",
  data() {
    return {
      offset: 0,
    };
  },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    progress(newValue) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      this.offset = barWidth * newValue;
    },
  },
  computed: {
    progressStyle() {
      return `width: ${this.offset}px`;
    },
    progressBtnStyle() {
      return `transform: translateX(${this.offset}px)`;
    },
  },
  created() {
    this.touchObj = {};
  },
  methods: {
    ontouchstart(e) {
      this.touchObj.x1 = e.touches[0].pageX;
      this.touchObj.progressWidth = this.$refs.progress.clientWidth;
    },
    ontouchmove(e) {
      this.touchObj.x2 = e.touches[0].pageX;
      const detal = this.touchObj.x2 - this.touchObj.x1;
      this.touchObj.newProgressWidth = this.touchObj.progressWidth + detal;
      this.offset = this.touchObj.newProgressWidth;

      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const newProgress = this.offset / barWidth;
      this.$emit("progressChanging", newProgress);
    },
    ontouchend(e) {
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      const newProgress = this.offset / barWidth;
      this.$emit("progressChanged", newProgress);
    },
    handleProgressJump(e) {
      // 进度条长度 = 整个组件的根元素的宽度 - 小圆点的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth;
      // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置
      const rect = this.$el.getBoundingClientRect();
      const newProgressWidth = e.pageX - rect.left;
      const newProgress = newProgressWidth / barWidth;
      this.$emit("progressChanged", newProgress);
    },
  },
  emits: ["progressChanging", "progressChanged"],
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
