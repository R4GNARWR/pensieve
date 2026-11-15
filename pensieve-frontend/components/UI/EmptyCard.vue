<template>
    <div class="card-main py-5 px-8" @click="openAddMemory">
        <UIButton class="card-main__button mb-5" variant="icon" aria-label="Добавить воспоминание" @click="emit('onClosedClick')">
            <img src="/images/svg/add.svg" alt="">
        </UIButton>
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