<template>
    <div class="archive-item">
        <div class="archive-item__header">
            <div class="archive-item__header-title">
                2025 год
            </div>
            <div class="archive-item__header-count">
                всего 24 воспоминания
            </div>
        </div>
        <button class="archive-item__btn btn-cloud btn-cloud-white">Открыть</button>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.archive-item {
    position: relative;
    width: 600px;
    height: 685px;
    background-image: url("/images/png/archiveBackground.png");
    background-size: contain;
    background-repeat: no-repeat;
}
.archive-item__header {
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    width: 300px;
    height: 125px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    row-gap: 12px;
    background-image: url("/images/png/pink-back.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    // archive-item__header-title
    &-title {
        font-size: rems(32px);
        line-height: 1em;
    }
    // archive-item__header-count
    &-count {
        font-size: rems(20px);
        line-height: 1em;
    }
}

.archive-item__btn {
    position: absolute;
    left: 50%;
    bottom: 20%;
    transform: translateX(-50%);
}
</style>