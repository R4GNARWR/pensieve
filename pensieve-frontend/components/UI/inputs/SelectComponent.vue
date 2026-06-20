<template>
  <div class="select-wrap" :class="{ expanded: isOpened }">
    <div
      class="select-head"
      @click="isOpened = !isOpened"
      v-html="selectHead"
    ></div>
    <div class="select-list__bg">
      <ul class="select-list" v-show="isOpened">
        <li v-for="item in list" :key="item.value">
          <button @click="selectItem(item)" v-html="item.title"></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { listItem } from "~/types/Select";
const isOpened: Ref<boolean> = ref(false);
const modelValue = defineModel<string | number | null>();
const emit = defineEmits(["onChange"]);
const selectHead = computed(() => {
  if (modelValue.value) {
    const selected = props.list.find(
      (el) => el.value == modelValue.value
    )?.title;
    if (selected) return selected;
  }
  return props.placeholder;
});
const props = withDefaults(
  defineProps<{
    list: Array<listItem>;
    placeholder: string;
  }>(),
  {
    placeholder: "Выберите значение",
  }
);

const selectItem = (item: listItem) => {
  modelValue.value = item.value;
  isOpened.value = false;
  emit("onChange", item);
};
</script>

<style lang="scss">
.select-wrap {
  min-width: 195px;
  position: relative;
  padding: 15px 10px;
  font-size: rems(24px);
  line-height: 1em;
  text-align: center;
  z-index: 900;

  sup {
    margin-left: 0.2em;
  }

  @media (max-width: 576px) {
    min-width: unset;
    width: 100%;
  }
}

.select-head {
  position: relative;
  z-index: 1;
}

.select-list {
  list-style: none;
  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: 1px solid $pink;
    background-color: $white;
    border-radius: 15px;
    padding-top: calc(1em + 15px * 2);
  }

  li {
    padding: 8px 0;
    border-bottom: 1px solid $pink;
  }
}
</style>
