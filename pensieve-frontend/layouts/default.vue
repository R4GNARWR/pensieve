<template>
  <div>
    <v-app>
      <TheHeader></TheHeader>
      <MenuComponent></MenuComponent>
      <main>
        <slot></slot>
      </main>
      <AddMemory v-if="userStore.user?.id && settingsStore.isAddMemoryModalVisible"/>
    </v-app>
    <AuthModal v-if="settingsStore.isAuthModalVisible"/>
    <AddUserToSpaceModal></AddUserToSpaceModal>
    <Popup
        :message="popup?.message ?? ''"
        :variant="popup?.variant"
        @close="settingsStore.popups.shift()"
    />
  </div>
</template>

<script setup lang="ts">
import AddUserToSpaceModal from "~/components/UI/modals/AddUserToSpaceModal.vue";

const settingsStore = useSettingsStore();
const userStore = useUserStore();
const popup = computed(() => settingsStore.popups[0]);
</script>

<style lang="scss"></style>
