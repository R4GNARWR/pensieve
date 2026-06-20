<template>
    <div>
        <div class="container">
            <h1>{{ error?.statusCode }} - {{ error?.message }}</h1>
            <nuxt-link to="/">На главную</nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
const props = defineProps({
    error: Object as () => NuxtError
})
</script>

<style scoped></style>