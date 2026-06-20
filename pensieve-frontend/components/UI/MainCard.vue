<template>
    <div class="card-main py-5 px-sm-8 px-6">
        <button class="card-main__button mb-5" v-show="!memory?.photo || !isMemoryActive"
            @click="emit('onClosedClick')">
            <img src="/images/svg/lock.svg" alt="">
        </button>
        <div class="card-main__image mb-5" v-show="memory?.photo && isMemoryActive">
            <!-- TODO: Переделдать статичный uploads-->
            <NuxtImg :src="`${staticUrl}/uploads/${memory?.photo}`" :alt="memory?.name ?? ''"></NuxtImg>
        </div>
        <div class="card-main__info">
            <div class="card-main__info-title mb-4">
                {{ computedName }}
            </div>
            <div class="card-main__info-date">
                {{ computedDate }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Memory } from '~/types/Memory';
const config = useRuntimeConfig();
const staticUrl = config.public.static;

const props = withDefaults(
    defineProps<{
        memory: Omit<Memory, 'id'> | Memory;
        insertMode?: boolean;
    }>(),
    {
        insertMode: false
    }
);

const emit = defineEmits(['onClosedClick']);
const currentYear = new Date().getFullYear();

const isMemoryActive = computed(() => {
    return new Date(props.memory?.date) > new Date() ? true : false;
})

const computedName = computed(() => {
    if (props.insertMode || isMemoryActive.value) {
        return props?.memory.name
    }
    return `Откроется в ${currentYear + 1}`;
})

const computedDate = computed(() =>
    props.memory?.date ?
        new Date(props.memory.date).toLocaleDateString('ru-RU', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }) :
        null
);
</script>