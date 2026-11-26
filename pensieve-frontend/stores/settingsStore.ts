import type {PopupVariant} from "~/types/Popup";

export const useSettingsStore = defineStore('settings', () => {
    const isAuthModalVisible : Ref<Boolean> = ref(false);
    const isMenuVisible : Ref<Boolean> = ref(false);
    const isAddMemoryModalVisible : Ref<Boolean> = ref(false);
    const isAddUserModalVisible : Ref<Boolean> = ref(false);
    const selectedYear : Ref<number> = ref(new Date().getFullYear());
    const popups = ref<{ message: string; variant: PopupVariant }[]>([]);
    return {isAuthModalVisible, isMenuVisible, isAddMemoryModalVisible, isAddUserModalVisible, selectedYear, popups}
  })
