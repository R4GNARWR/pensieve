<template>
    <section id="galleryPage">
        <div class="gallery-page__header">
            <h2>{{ selectedYear }} год</h2>
            <p>всего {{ totalMemoriesCount }} воспоминания</p>
            <p v-if="loadError" role="alert">{{ loadError }}</p>
        </div>
        <GalleryMain :memories="memories"></GalleryMain>
    </section>
    <AddMemory></AddMemory>
</template>

<script setup lang="ts">
const spaceStore = useSpaceStore();
const settingsStore = useSettingsStore();
const memoriesStore = useMemoriesStore();
const selectedYear = computed(() => settingsStore.selectedYear);
const selectedSpaceId = computed(() => spaceStore.selectedSpaceId);
const memories = computed(() => memoriesStore.memories)
const loadError = ref("");
let requestId = 0;
onScopeDispose(() => { requestId++; });

const totalMemoriesCount = computed(() =>
    Object.values(memories.value[selectedYear.value] ?? {})
        .reduce((total, items) => total + items.length, 0)
);

watch(
    [selectedSpaceId, selectedYear, () => memoriesStore.refreshVersion],
    async ([spaceId, year], previous) => {
        const currentRequest = ++requestId;
        loadError.value = "";
        if (!previous || previous[0] !== spaceId) {
            memoriesStore.memories = {};
        }
        if (!spaceId) return;

        try {
            const { data: response, error } = await useGetMemories(spaceId, year);
            if (currentRequest !== requestId) return;
            if (error.value && getErrorStatus(error.value) !== 404) throw error.value;
            memoriesStore.memories[year] = response.value?.data ?? {};
        } catch (error) {
            if (currentRequest !== requestId) return;
            delete memoriesStore.memories[year];
            loadError.value = "Не удалось загрузить воспоминания";
        }
    },
    { immediate: true, flush: "sync" }
);
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
