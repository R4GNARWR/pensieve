<template>
  <SelectComponent v-model="modelValue" placeholder="Выбрать месяц" :list="availableMonths"
                   @on-change="emit('onChange')">
    <template #option="{ item }">
            <span class="month-option">
                <span>{{ item.title }}</span>
                <span v-if="memories?.[item.value]?.length" class="month-option__count">
                    {{ memories[item.value].length }}
                </span>
            </span>
    </template>
  </SelectComponent>
</template>

<script setup lang="ts">
const memoriesStore = useMemoriesStore();
const settingsStore = useSettingsStore();
const modelValue = defineModel<number | string | null>();
const props = defineProps<{ lastMonth: number }>();
const emit = defineEmits(['onChange'])

const selectedYear = computed(() => settingsStore.selectedYear)
const memories = computed(() => memoriesStore.memories?.[selectedYear.value]);

const months = [
    { value: '1', title: 'Январь' },
    { value: '2', title: 'Февраль' },
    { value: '3', title: 'Март' },
    { value: '4', title: 'Апрель' },
    { value: '5', title: 'Май' },
    { value: '6', title: 'Июнь' },
    { value: '7', title: 'Июль' },
    { value: '8', title: 'Август' },
    { value: '9', title: 'Сентябрь' },
    { value: '10', title: 'Октябрь' },
    { value: '11', title: 'Ноябрь' },
    { value: '12', title: 'Декабрь' }
];

const availableMonths = computed(() => months.slice(0, props.lastMonth));
</script>

<style lang="scss" scoped>
@use "sass:color";

:deep(.select-list li) {
  padding: 0;
  border: 0;

  .ui-button {
    display: block;
    width: 100%;
    transition: background-color 160ms ease;

    &:hover,
    &:focus-visible {
      background-color: $pink-light;
    }

    &:focus-visible {
      outline-offset: -2px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
}

.month-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 44px;
  padding: 4px 12px;
  font-size: rems(20px);

  &__count {
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    min-width: 1.25rem;
    aspect-ratio: 1;
    padding-inline: 0.25rem;
    border-radius: 50%;
    background-color: color.scale($pink-light, $lightness: -48%);
    color: $white;
    font-size: rems(12px);
    line-height: 1;
  }
}
</style>
