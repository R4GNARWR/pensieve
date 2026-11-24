<template>
  <div class="card-main py-5 px-sm-8 px-6">
    <UIButton
        v-if="insertMode && (photoLoading || !memory?.photo)"
      class="card-main__button mb-5"
      variant="icon"
      :loading="photoLoading"
      @click="emit('onClosedClick')"
    >
      <img src="/images/svg/lock.svg" alt="" />
    </UIButton>
    <div v-if="!insertMode && !memory?.photo" class="card-main__button mb-5" aria-hidden="true"></div>
    <div v-if="memory?.photo" class="card-main__image mb-5">
      <img
          :src="`${staticUrl}uploads/${memory.photo}`"
        :alt="memory?.name ?? ''"
      />
    </div>
    <div class="card-main__info">
      <div class="card-main__info-title mb-4">
        {{ memory.name }}
      </div>
      <div class="card-main__info-date">
        {{ computedDate }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Memory } from "~/types/Memory";
const config = useRuntimeConfig();
const staticUrl = config.public.static;

const props = withDefaults(
  defineProps<{
    memory: Omit<Memory, "id"> | Memory;
    insertMode?: boolean;
    photoLoading?: boolean;
  }>(),
  {
    insertMode: false,
    photoLoading: false,
  },
);

const emit = defineEmits(["onClosedClick"]);

const computedDate = computed(() =>
  props.memory?.date
    ? new Date(props.memory.date).toLocaleDateString("ru-RU", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      })
    : null,
);
</script>
