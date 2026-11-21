<template>
  <div>
    <v-app>
      <TheHeader></TheHeader>
      <MenuComponent></MenuComponent>
      <main>
        <slot></slot>
      </main>
    </v-app>
    <AuthModal v-if="settingsStore.isAuthModalVisible"/>
    <AddUserToSpaceModal></AddUserToSpaceModal>
  </div>
</template>

<script setup lang="ts">
import AddUserToSpaceModal from "~/components/UI/modals/AddUserToSpaceModal.vue";

const settingsStore = useSettingsStore();
</script>

<style lang="scss"></style>
