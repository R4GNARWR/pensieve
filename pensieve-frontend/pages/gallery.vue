<template>
    <section id="galleryPage">
        <div class="gallery-page__header">
            <h2>2025 год</h2>
            <p>всего {{ totalMemoriesCount }} воспоминания</p>
        </div>
        <GalleryMain :memories="memories"></GalleryMain>
    </section>
    <AddMemory></AddMemory>
</template>

<script setup lang="ts">
const spaceStore = useSpaceStore();
const memoriesStore = useMemoriesStore();
const selectedSpaceId = computed(() => spaceStore.selectedSpaceId);
const memories = computed(() => memoriesStore.memories)

const totalMemoriesCount = computed(() => {
    let total = 0;
    const memoriesObj = memories.value;
    for (const key in memoriesObj) {
        if (memoriesObj.hasOwnProperty(key)) {
            const value = memoriesObj[key];
            if (Array.isArray(value)) {
                total += value.length;
            }
        }
    }
    return total;
})

watch(selectedSpaceId, async (newSpaceID) => {
    if (!newSpaceID) return;
    const currentYear = new Date().getFullYear()
    const { data: response } = await useGetMemories(newSpaceID);
    if (response.value?.data) {
        memoriesStore.memories[currentYear] = response.value.data;
    } else {
        console.debug('Не пришло ни одного воспоминания')
    }
}, { immediate: true })
</script>

<style lang="scss">
.gallery-page__header {
    margin: 0 auto;
    width: 455px;
    max-width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url("/images/png/pink-back.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    h2 {
        margin-bottom: 20px;
        font-size: rems(48px);
        line-height: 1em;
    }

    p {
        margin-bottom: 0;
        line-height: 1em;
        font-size: rems(24px);
    }
}
</style>