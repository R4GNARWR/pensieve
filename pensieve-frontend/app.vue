<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const userStore = useUserStore();
const userToken = useCookie('user_token');
if (userToken.value && !userStore.user) {
  await useAuthorizeUser();
}
if (userStore.user?.id) {
  useGetSpaces()
}
</script>
<style lang="scss"></style>
