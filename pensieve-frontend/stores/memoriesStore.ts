import type { Memory } from "~/types/Memory";
export const useMemoriesStore = defineStore("memories", () => {
  const memories: Ref<Record<string, Record<string, Memory[]>>> = ref({});
  return { memories };
});
