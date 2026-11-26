<template>
  <!-- To-do: Разделить компонент, возможно на шапку и основу -->
  <div class="d-flex flex-column align-center">
    <div class="gallery-month-navigation">
      <div class="gallery-month-navigation__controls">
        <UIButton
            variant="icon"
            class="gallery-month-navigation__previous"
            title="Предыдущий месяц"
            :disabled="!canGoToPreviousMonth"
            @click="changeMonth(-1)"
        />
        <MonthSelect v-model="selectedMonth" :last-month="lastMonth"/>
        <UIButton
            variant="icon"
            class="gallery-month-navigation__next"
            title="Следующий месяц"
            :disabled="!canGoToNextMonth"
            @click="changeMonth(1)"
        />
      </div>
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
          <UIButton variant="icon" title="Предыдущая страница" :disabled="currentPage === 1"
                    @click="changePage(-1)">
            <img src="/images/svg/arrow-bold.svg" alt="" />
          </UIButton>
          <UIButton variant="icon" title="Следующая страница" :disabled="currentPage === totalPages"
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
import {MIN_MEMORY_YEAR} from "~/constants/memoryDates";
const spaceStore = useSpaceStore();
const settingsStore = useSettingsStore();
const props = defineProps<{
  memories: Record<string, Record<string, Memory[]>>;
}>();

const selectedStoreYear: ComputedRef<number> = computed(
  () => settingsStore.selectedYear
);
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const selectedMonth = ref<number | string | null>(currentMonth);

const monthNumber = computed(() => Number(selectedMonth.value));

/** Последний доступный месяц выбранного года */
const lastMonth = computed(() => selectedStoreYear.value === currentYear ? currentMonth : 12);

/** Нижняя граница навигации совпадает с началом первого доступного года */
const canGoToPreviousMonth = computed(() =>
    monthNumber.value > 1 || selectedStoreYear.value > MIN_MEMORY_YEAR
);

/** Верхняя граница навигации совпадает с текущим месяцем */
const canGoToNextMonth = computed(() =>
    monthNumber.value < lastMonth.value || selectedStoreYear.value < currentYear
);

/** Переключает месяц с переходом между декабрём и январём соседних лет */
const changeMonth = (direction: -1 | 1) => {
  if (direction === -1 ? !canGoToPreviousMonth.value : !canGoToNextMonth.value) return;

  const month = monthNumber.value + direction;
  if (month === 0) {
    settingsStore.selectedYear--;
    selectedMonth.value = 12;
  } else if (month === 13) {
    selectedMonth.value = 1;
    settingsStore.selectedYear++;
  } else {
    selectedMonth.value = month;
  }
};

/** При выборе текущего года заменяет будущий месяц на текущий */
watch(lastMonth, (limit) => {
  if (monthNumber.value > limit) selectedMonth.value = limit;
}, {flush: "sync"});

/** Воспоминания за выбранный год и месяц */
const currentMonthMemories = computed(() => {
  return selectedMonth.value
    ? props.memories?.[selectedStoreYear.value]?.[selectedMonth.value] || []
    : [];
});

const pageSize = ref(2);
const currentPage = ref(1);

/** Число страниц с учётом карточки добавления и минимумом в одну страницу */
const totalPages = computed(() => {
  const memoryCount = currentMonthMemories.value.length;
  const addCardCount = spaceStore.selectedSpaceId ? 1 : 0;
  const cardCount = memoryCount + addCardCount;
  const pageCount = Math.ceil(cardCount / pageSize.value);

  return Math.max(1, pageCount);
});

let mobileViewport: MediaQueryList | undefined;

/** Подбирает размер страницы и сохраняет видимость её первой карточки при изменении ширины */
const updatePageSize = () => {
  const nextPageSize = mobileViewport?.matches ? 1 : 2;
  const firstCardIndex = (currentPage.value - 1) * pageSize.value;
  pageSize.value = nextPageSize;
  currentPage.value = Math.floor(firstCardIndex / nextPageSize) + 1;
};

onMounted(() => {
  mobileViewport = window.matchMedia("(max-width: 576px)");
  updatePageSize();
  mobileViewport.addEventListener("change", updatePageSize);
});

onUnmounted(() => {
  mobileViewport?.removeEventListener("change", updatePageSize);
});

/** Возвращает на первую страницу при смене пространства или периода */
watch([() => spaceStore.selectedSpaceId, selectedStoreYear, selectedMonth], () => {
  currentPage.value = 1;
}, {flush: "sync"});

/** Удерживает текущую страницу в доступном диапазоне при сокращении списка */
watch(totalPages, (pages) => {
  currentPage.value = Math.min(currentPage.value, pages);
});

/** Воспоминания для текущей страницы */
const pageMemories = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return currentMonthMemories.value.slice(startIndex, startIndex + pageSize.value);
});

/** Переключает страницу в пределах доступного диапазона */
const changePage = (value: number) => {
  const newPage = currentPage.value + value;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

/** Открывает форму добавления воспоминания */
const openAddMemory = () => {
  settingsStore.isAddMemoryModalVisible = true;
};
</script>

<style lang="scss" scoped>
.gallery-month-navigation {
  position: relative;
  width: min(280px, calc(100% - 24px));
  min-width: 0;
  padding: 4px;
  border: 1px solid $pink;
  border-radius: 10px;
  background: $white;

  &__controls {
    display: flex;
    align-items: center;
  }

  .ui-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 44px;
    height: 44px;
    border-radius: 10px;
    transition: background-color 160ms ease, opacity 160ms ease, transform 160ms ease;

    &:enabled:hover,
    &:focus-visible {
      background-color: $pink-light;
    }

    &:enabled:active {
      background-color: $pink;
      transform: scale(0.94);
    }

    &:disabled {
      opacity: 0.4;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &:enabled:active {
        transform: none;
      }
    }
  }

  &__previous::before,
  &__next::before,
  :deep(.select-head::after) {
    display: inline-block;
    width: 0.55em;
    height: 0.55em;
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    content: "";
  }

  &__previous::before {
    transform: rotate(135deg);
  }

  &__next::before {
    transform: rotate(-45deg);
  }

  :deep(.select-wrap) {
    position: static;
    flex: 1 1 auto;
    min-width: 0;
    padding: 0;
  }

  :deep(.select-head) {
    min-height: 44px;
    padding-block: 10px;
  }

  :deep(.select-head::after) {
    margin-inline-start: 8px;
    font-size: rems(16px);
    vertical-align: middle;
    transform: translateY(-2px) rotate(45deg);
  }

  :deep(.select-list__bg) {
    display: none;
    top: calc(100% + 6px);
    inset-inline: -1px;
    width: auto;
    max-height: 45vh;
    padding-top: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: $pink transparent;

    @media (max-height: 640px) {
      max-height: 35vh;
    }
  }

  :deep(.select-wrap.expanded .select-list__bg) {
    display: block;
  }
}

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
      gap: 24px;
    }

    @media (max-width: 768px) {
      padding: 50px 20px 0 20px;
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: repeat(1, 1fr);
      row-gap: 12px;
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

    @media (max-width: 576px) {
      padding-top: 0;
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
