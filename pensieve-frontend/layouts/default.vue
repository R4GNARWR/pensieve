<template>
  <div>
    <v-app>
      <TheHeader></TheHeader>
      <MenuComponent></MenuComponent>
      <main>
        <slot></slot>
      </main>
    </v-app>
    <AuthModal></AuthModal>
    <AddUserToSpaceModal></AddUserToSpaceModal>
  </div>
</template>

<script setup lang="ts">
import AddUserToSpaceModal from "~/components/UI/modals/AddUserToSpaceModal.vue";
</script>

<style lang="scss"></style>
