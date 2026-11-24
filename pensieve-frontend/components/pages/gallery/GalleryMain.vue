<template>
  <!-- To-do: Разделить компонент, возможно на шапку и основу -->
  <div class="d-flex flex-column align-center">
    <div class="d-flex ga-5 px-4 w-100 w-sm-auto">
      <MonthSelect
        v-model="selectedMonth"
        class="mx-auto"
      />
      <YearsSelect
          :model-value="selectedStoreYear"
          @on-change="changeYear($event.value)"
      />
    </div>
    <UIButton
        v-if="spaceStore.selectedSpaceId"
        class="gallery-add-button mt-4"
        label="Добавить"
        variant="white-pink"
        @click="openAddMemory"
    />

    <div class="gallery-main">
      <div class="gallery-main__wrapper">
        <div
            v-for="memory of pageMemories"
            :key="memory.id"
            class="gallery-main__wrapper-item"
        >
          <MainCard :memory="memory"/>
        </div>
        <div
            v-if="spaceStore.selectedSpaceId && currentPage === totalPages"
            class="gallery-main__wrapper-item"
        >
          <EmptyCard @click="openAddMemory"/>
        </div>
        <div
          class="gallery-main__arrows"
          v-show="totalPages > 1"
        >
          <UIButton variant="icon" aria-label="Предыдущая страница" :disabled="currentPage === 1"
                    @click="changePage(-1)">
            <img src="/images/svg/arrow-bold.svg" alt="" />
          </UIButton>
          <UIButton variant="icon" aria-label="Следующая страница" :disabled="currentPage === totalPages"
                    @click="changePage(1)">
            <img src="/images/svg/arrow-bold.svg" alt="" />
          </UIButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Memory } from "~/types/Memory";
const spaceStore = useSpaceStore();
const settingsStore = useSettingsStore();
const props = defineProps<{
  memories: Record<string, Record<string, Memory[]>>;
}>();

const selectedStoreYear: ComputedRef<number> = computed(
  () => settingsStore.selectedYear
);
const selectedMonth = ref<number | string | null>(new Date().getMonth() + 1);
const currentMonthMemories = computed(() => {
  return selectedMonth.value
    ? props.memories?.[selectedStoreYear.value]?.[selectedMonth.value] || []
    : [];
});

const pageSize = 2;
const currentPage = ref(1);
const totalPages = computed(() =>
    Math.ceil((currentMonthMemories.value.length + 1) / pageSize)
);

watch([() => spaceStore.selectedSpaceId, selectedStoreYear, selectedMonth], () => {
  currentPage.value = 1;
});
watch(totalPages, (pages) => {
  currentPage.value = Math.min(currentPage.value, pages);
});

const pageMemories = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return currentMonthMemories.value.slice(startIndex, startIndex + pageSize);
});

const changePage = (value: number) => {
  const newPage = currentPage.value + value;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

const changeYear = (year: number) => {
  settingsStore.selectedYear = year;
};

const openAddMemory = () => {
  settingsStore.isAddMemoryModalVisible = true;
};
</script>

<style lang="scss" scoped>
.gallery-add-button {
  padding: rems(12px) rems(24px);
  font-size: rems(24px);
  text-transform: none;
}

.gallery-main {
  margin: 0 auto;
  position: relative;
  width: 1100px;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1.72/1;
  background-image: url("/images/png/galleryBook.png");
  background-position: center top;
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-width: 1000px) {
    width: 100%;
    aspect-ratio: auto;
    background: transparent;
  }

  &__wrapper {
    margin: 0 -20px;
    position: absolute;
    left: 21%;
    top: 8%;
    width: 62%;
    max-width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 1000px) {
      padding: 100px 40px 0 40px;
      margin: 0;
      position: static;
      height: auto;
      width: auto;
      max-width: unset;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      padding: 50px 20px 0 20px;
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: repeat(1, 1fr);
    }

    &-item {
      padding: 0 20px;
      width: 50%;
      @media (max-width: 1000px) {
        padding: 0;
        width: 100%;
      }
      @media (max-width: 576px) {
        margin: 0 auto;
        max-width: 300px;
      }
    }
  }

  &__arrows {
    padding: 0 20px;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    @media (max-width: 1000px) {
      position: static;
      grid-column: 1 / -1;
      padding: 16px 0 0;
    }

    button {
      &:disabled {
        opacity: 0.4;
      }

      img {
        width: 60px;
        height: 40px;
        object-fit: contain;
      }

      &:nth-child(1) {
        transform: rotate(90deg);
      }

      &:nth-child(2) {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
