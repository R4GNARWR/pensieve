<template>
  <SelectComponent class="years-select" v-model="modelValue" placeholder="Выбрать год" :list="years"
                   @on-change="emit('onChange', $event)"></SelectComponent>
</template>

<script setup lang="ts">
import type { listItem } from '~/types/Select'
import {MIN_MEMORY_YEAR} from '~/constants/memoryDates'
const modelValue = defineModel<number | string | null>();
const emit = defineEmits(['onChange'])
const years: Array<listItem> = [];
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= MIN_MEMORY_YEAR; i--) {
    years.push({
        value: i,
        title: i,
    });
};
</script>

<style scoped>
.years-select :deep(.select-list) {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
