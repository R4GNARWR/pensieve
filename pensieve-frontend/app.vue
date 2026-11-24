<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const userStore = useUserStore();
const { accessToken, refreshToken } = useAuthTokens();
if ((accessToken.value || refreshToken.value) && !userStore.user) {
  await useAuthorizeUser();
}
await useSpaceContext();
</script>
<style lang="scss"></style>
