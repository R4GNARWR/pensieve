<template>
    <IndexDiary></IndexDiary>
    <IndexTransition></IndexTransition>
    <IndexLetter></IndexLetter>
    <IndexSupport></IndexSupport>
    <IndexFooter></IndexFooter>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();
if (route.query.login) {
    settingsStore.isAuthModalVisible = true;
}
</script>

<style lang="scss"></style>