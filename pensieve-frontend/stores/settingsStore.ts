export const useSettingsStore = defineStore('settings', () => {
    const isAuthModalVisible : Ref<Boolean> = ref(false);
    const isMenuVisible : Ref<Boolean> = ref(false);
    const isAddMemoryModalVisible : Ref<Boolean> = ref(false);
    const selectedYear : Ref<number> = ref(new Date().getFullYear());
    return { isAuthModalVisible, isMenuVisible, isAddMemoryModalVisible, selectedYear }
  })