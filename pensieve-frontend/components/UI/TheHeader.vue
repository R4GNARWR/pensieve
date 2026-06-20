<template>
  <header>
    <button
      class="btn btn-white-pink me-auto"
      @click="openMenu"
      v-show="userData"
    >
      Меню
    </button>
    <button
      class="btn btn-white-pink ms-auto"
      @click="openAuthModal"
      v-show="!userData"
    >
      Вход
    </button>
  </header>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const userData = computed(() => userStore.user);
const openAuthModal = () => {
  settingsStore.isAuthModalVisible = true;
};
const openMenu = () => {
  settingsStore.isMenuVisible = true;
};
</script>

<style lang="scss">
header {
  padding: 20px 70px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: auto;
  max-width: 100vw;
  display: flex;
  align-items: flex-end;
  background: transparent;

  @media (max-width: 768px) {
    padding: 20px;
  }
}
</style>
