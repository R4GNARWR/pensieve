<template>
  <dialog ref="dialog" class="years-select">
    <div class="years-select__header d-flex justify-space-between align-center ga-3 mb-4">
      <h2>Выбрать год</h2>
      <UIButton label="Закрыть" variant="text" @click="dialog?.close()"/>
    </div>
    <div class="years-select__list">
      <UIButton
          v-for="year in years"
          :key="year"
          variant="text"
          :label="String(year)"
          :class="{ 'years-select__selected': year === modelValue }"
          :autofocus="year === modelValue"
          @click="selectYear(year)"
      />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import {MIN_MEMORY_YEAR} from "~/constants/memoryDates";

const modelValue = defineModel<number>({required: true});
const dialog = ref<HTMLDialogElement | null>(null);
const years: number[] = [];

for (let year = new Date().getFullYear(); year >= MIN_MEMORY_YEAR; year--) {
  years.push(year);
}

const selectYear = (year: number) => {
  modelValue.value = year;
  dialog.value?.close();
};

defineExpose({open: () => dialog.value?.showModal()});
</script>

<style lang="scss" scoped>
.years-select {
  width: min(420px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 20px;
  border: 1px solid $pink;
  border-radius: 16px;
  background: $white;
  color: $black;

  &::backdrop {
    background: rgb(0 0 0 / 45%);
  }

  &__header {
    h2 {
      font-size: rems(24px);
    }

    button {
      min-height: 44px;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(76px, 1fr));
    gap: 10px;

    button {
      min-height: 52px;
      border: 1px solid $pink;
      border-radius: 8px;
      font-size: rems(20px);
      font-weight: 500;

      &:hover,
      &.years-select__selected {
        background: $pink;
      }
    }

    @media (max-width: 576px) {
      grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
      gap: 12px;

      button {
        min-height: 64px;
        font-size: rems(24px);
      }
    }
  }
}
</style>
