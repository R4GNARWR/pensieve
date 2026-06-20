<template>
    <SelectComponent v-model="modelValue" placeholder="Выбрать год" :list="years" @on-change="emit('onChange', $event)"></SelectComponent>
</template>

<script setup lang="ts">
import type { listItem } from '~/types/Select'
const modelValue = defineModel<number | string | null>();
const emit = defineEmits(['onChange'])
const years: Array<listItem> = [];
const currentYear = new Date().getFullYear();
const startYear: number = new Date().getFullYear() - 10;
for (let i = currentYear; i >= startYear; i--) {
    years.push({
        value: i,
        title: i,
    });
};
</script>