import type { Space } from "~/types/Space";
export const useSpaceStore = defineStore("space", () => {
  const spaces: Ref<Space[]> = ref([]);
  const selectedSpaceId: Ref<number | null> = ref(null);
  return { spaces, selectedSpaceId };
});
