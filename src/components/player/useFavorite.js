import { useStore } from "vuex";
import { computed } from "vue";
import { remove } from "@/assets/js/array-store";

export default function useFavorite() {
  const store = useStore();
  const favoriteList = computed(() => store.state.favoriteList);

  const isFavorite = (songObj) => {
    return favoriteList.value.findIndex((item) => item.id === songObj.id) > -1;
  };
  const getFavoriteIcon = (songObj) => {
    return isFavorite(songObj) ? "icon-favorite" : "icon-not-favorite";
  };

  const toggleFavorite = (songObj) => {
    if (isFavorite(songObj)) {
      // remove this song
    } else {
      // add this song
    }
  };

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
