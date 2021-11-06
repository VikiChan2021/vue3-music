import { useStore } from "vuex";
import { PLAY_MODE } from "@/assets/js/constant";
import { computed } from "vue";

export default function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.playMode);

  const modeIcon = computed(() => {
    return playMode.value === PLAY_MODE.sequence
      ? "icon-sequence"
      : playMode.value === PLAY_MODE.loop
      ? "icon-loop"
      : "icon-random";
  });
  const changeMode = () => {
    const index = (playMode.value + 1) % 3;
    store.dispatch("changeMode", index);
  };

  return {
    modeIcon,
    changeMode,
  };
}
