import { useStore } from "vuex";
import { computed, watch } from "vue";
import request from "@/utils/request";
import { parseLyric } from "@/utils/parseLyric";

export default function useLyric() {
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);

  let lyricList;
  watch(currentSong, async (newSong) => {
    if (!newSong.id) return;
    const lyricData = await request("/lyric", { id: newSong.id });
    const lyricStr = lyricData.lrc.lyric;
    // store.commit(
    //   'addSongLyric',{song:newSong,lyric: lyricStr}
    // )
    lyricList = parseLyric(lyricStr);
    // console.log(lyricList);
  });

  return {
    lyricList,
  };
}
