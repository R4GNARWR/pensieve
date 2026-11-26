<template>
  <dialog ref="dialog" class="menu-wrapper" @cancel.prevent="closeMenu">
    <UIButton class="menu-close" variant="icon" title="Закрыть меню" autofocus @click="closeMenu"/>
    <div class="menu">
      <div class="menu-head">меню</div>
      <ul class="menu-links">
        <li>
          <NuxtLink to="/gallery" @click="closeMenu">Галерея</NuxtLink>
        </li>
        <li><UIButton label="Добавить пользователя" variant="text" @click="openAddUserModal" /></li>
        <li>
          <UIButton
              label="Добавить запись"
              variant="text"
              :disabled="!spaceStore.selectedSpaceId"
              @click="openAddMemoryModal"
          />
          <p v-if="!spaceStore.selectedSpaceId" class="menu-hint">Сначала выберите пространство</p>
        </li>
        <li><UIButton label="Выйти" variant="text" @click="logout" /></li>
      </ul>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const spaceStore = useSpaceStore();
const dialog = ref<HTMLDialogElement | null>(null);

watchPostEffect(() => {
  if (settingsStore.isMenuVisible && userStore.user?.id) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
});

const closeMenu = () => {
  settingsStore.isMenuVisible = false;
  dialog.value?.close();
};

const openAddUserModal = () => {
  closeMenu();
  settingsStore.isAddUserModalVisible = true;
};

const openAddMemoryModal = () => {
  if (!spaceStore.selectedSpaceId) return;
  closeMenu();
  settingsStore.isAddMemoryModalVisible = true;
};

const logout = () => {
  closeMenu();
  return useLogout();
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: $blue;

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

  a {
    text-decoration: none;
    color: inherit;
  }

  button:disabled {
    opacity: 0.55;
    cursor: default;
  }
}

.menu-hint {
  margin-top: 8px;
  font-size: rems(20px);
}

.menu-close {
  position: absolute;
  top: 36px;
  right: 56px;
  width: 43px;
  height: 43px;
  background: url("/images/svg/close-dark.svg") center / contain no-repeat;
}

.menu-wrapper :is(button, a):focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
</style>
