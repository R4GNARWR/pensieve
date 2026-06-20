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
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss"></style>