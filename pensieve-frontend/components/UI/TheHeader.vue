<template>
  <header>
    <UIButton
      v-show="userData"
      class="me-auto"
      label="Меню"
      variant="white-pink"
      @click="openMenu"
    />
    <UIButton
      v-show="!userData"
      class="ms-auto"
      label="Вход"
      variant="white-pink"
      @click="openAuthModal"
    />
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
