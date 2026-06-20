<template>
    <SelectComponent v-model="modelValue" placeholder="Выбрать месяц" :list="computedMonthes"
        @on-change="emit('onChange')"></SelectComponent>
</template>

<script setup lang="ts">
const memoriesStore = useMemoriesStore();
const settingsStore = useSettingsStore();
const modelValue = defineModel<number | string | null>();
const emit = defineEmits(['onChange'])

const selectedYear = computed(() => settingsStore.selectedYear)
const memories = computed(() => memoriesStore.memories?.[selectedYear.value]);

const monthes = [
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

const computedMonthes = computed(() => {
    if(!memories.value) return monthes;
    const memoriesObj = memories.value;
    const monthesToReturn = [...monthes]
    for (const month of monthesToReturn) {
        if (memoriesObj[month.value]) {
            month.title += `<sup>${memoriesObj[month.value].length}</sup>`
        }
    }
    return monthesToReturn;
})
</script>