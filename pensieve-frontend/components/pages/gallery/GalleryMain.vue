<template>
  <!-- To-do: Разделить компонент, возможно на шапку и основу -->
  <div class="d-flex flex-column align-center">
    <div class="d-flex ga-5 px-4 w-100 w-sm-auto">
      <MonthSelect
        v-model="selectedMonth"
        class="mx-auto"
        @on-change="currentPage = 1"
      ></MonthSelect>
      <YearsSelect
        @on-change="changeYear($event.value)"
        :model-value="selectedYear"
      ></YearsSelect>
    </div>

    <div class="gallery-main">
      <div class="gallery-main__wrapper">
        <template v-if="computedMemories?.length">
          <div
            class="gallery-main__wrapper-item"
            v-for="memory of computedMemories"
          >
            <MainCard :memory="memory"></MainCard>
          </div>
        </template>
        <template v-else>
          <div class="gallery-main__wrapper-item">
            <EmptyCard></EmptyCard>
          </div>
        </template>
        <div
          class="gallery-main__arrows"
          v-show="currentMonthMemories?.length > 2"
        >
          <button @click="changePage(-1)">
            <img src="/images/svg/arrow-bold.svg" alt="Предыдущая страница" />
          </button>
          <button @click="changePage(1)">
            <img src="/images/svg/arrow-bold.svg" alt="Следующая страница" />
          </button>
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
const selectedYear: Ref<number | null> = ref(new Date().getFullYear());

const selectedMonth: Ref<number | null> = ref(new Date().getMonth() + 1);
const currentMonthMemories = computed(() => {
  return selectedMonth.value
    ? props.memories?.[selectedStoreYear.value]?.[selectedMonth.value] || []
    : [];
});

const currentSpaceId = computed(() => spaceStore.selectedSpaceId);

const currentPage: Ref<number> = ref(1);
const totalPages = computed(() => {
  return Math.ceil(currentMonthMemories.value.length / 2);
});

const computedMemories: ComputedRef<Memory[]> = computed(() => {
  const startIndex = (currentPage.value - 1) * 2;
  return currentMonthMemories.value.slice(startIndex, startIndex + 2);
});

const changePage = (value: number) => {
  const newPage = currentPage.value + value;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

const changeYear = async (year: number) => {
  currentPage.value = 1;
  settingsStore.selectedYear = year;
  if (currentSpaceId.value) await useGetMemories(currentSpaceId.value, year);
};
</script>

<style lang="scss" scoped>
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
    aspect-ratio: none;
    background: transparent;
  }

  // .gallery-main__wrapper
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

    // .gallery-main__wrapper-item
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

  // .gallery-main__arrow
  &__arrows {
    padding: 0 20px;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
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
