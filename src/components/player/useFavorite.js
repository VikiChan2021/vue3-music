import { useStore } from "vuex";
import { computed } from "vue";
import { save, remove } from "@/assets/js/array-store";
import { FAVORITE_KEY } from "@/assets/js/constant";

export default function useFavorite() {
  const store = useStore();
  const favoriteList = computed(() => store.state.favoriteList);
  const maxLen = 99;

  const isFavorite = (songObj) => {
    return favoriteList.value.findIndex((item) => item.id === songObj.id) > -1;
  };
  const getFavoriteIcon = (songObj) => {
    return isFavorite(songObj) ? "icon-favorite" : "icon-not-favorite";
  };

  const toggleFavorite = (songObj) => {
    let newList;
    const compare = (item) => item.id === songObj.id;
    if (isFavorite(songObj)) {
      // remove this song
      newList = remove(FAVORITE_KEY, compare);
    } else {
      // add this song
      newList = save(songObj, FAVORITE_KEY, compare, maxLen);
    }
    store.commit("setFavoriteList", newList);
  };

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
