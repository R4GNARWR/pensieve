<template>
    <div class="card-main py-5 px-8" @click="openAddMemory">
        <button class="card-main__button mb-5" @click="emit('onClosedClick')">
            <img src="/images/svg/add.svg" alt="">
        </button>
        <div class="card-main__info">
            <div class="card-main__info-title mb-4">
                Добавить воспоминание
            </div>
            <div class="card-main__info-date"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
const settingsStore = useSettingsStore();

const emit = defineEmits(['onClosedClick']);

const openAddMemory = () => {
    settingsStore.isAddMemoryModalVisible = true;
}
</script>