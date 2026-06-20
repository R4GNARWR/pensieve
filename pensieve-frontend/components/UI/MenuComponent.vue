<template>
  <div class="menu-wrapper" v-show="isMenuVisible && isAuth">
    <button class="close menu-close" @click="closeModal"></button>
    <div class="menu">
      <div class="menu-head">меню</div>
      <ul class="menu-links">
        <li><button>Добавить пользователя</button></li>
        <li><nuxt-link>Добавить запись</nuxt-link></li>
        <li><nuxt-link>Все архивы</nuxt-link></li>
        <li><button @click="logout">Выйти</button></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const isMenuVisible = computed(() => settingsStore.isMenuVisible);
const isAuth = computed(() => userStore.user?.id);
const closeModal = () => {
  settingsStore.isMenuVisible = false;
};
const logout = () => {
  useLogout();
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100dvh;
  background-color: $blue;
  z-index: 10000;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 400px;
    background-image: url("/images/webp/menu-bottom.webp");
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: bottom;
    z-index: -1;
  }
}

.menu {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.menu-head {
  position: relative;
  margin-bottom: 60px;
  font-size: rems(64px);
  line-height: 1em;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url("/images/svg/menu-cloud.svg");
    opacity: 0.7;
    mix-blend-mode: screen;
    background-size: contain;
    width: 600px;
    height: 200px;
    z-index: -1;
  }
}

.menu-links {
  display: flex;
  flex-direction: column;
  gap: 45px;
  list-style: none;
  font-size: rems(32px);
  line-height: 1em;
  text-align: center;
}

.menu-close {
  position: absolute;
  top: 36px;
  right: 56px;
  font-size: 0;

  &::after {
    position: static;
    transform: none;
    display: block;
    width: 43px;
    height: 43px;
    background-size: contain;
  }
}
</style>
