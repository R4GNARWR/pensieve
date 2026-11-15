<template>
  <button
    class="ui-button"
    :class="[variantClass, { 'ui-button--loading': loading }]"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading"
    @click="emit('click', $event)"
  >
    <span v-show="!loading" class="ui-button__content">
      <slot>{{ label }}</slot>
    </span>
    <TheLoader v-if="loading" />
  </button>
</template>

<script setup lang="ts">
const variantClasses = {
  default: "btn",
  "white-pink": "btn btn-white-pink",
  "cloud-pink": "btn-cloud btn-cloud-pink",
  "cloud-white": "btn-cloud btn-cloud-white",
  auth: "btn-auth text-primary-pink",
  text: "",
  icon: "",
} as const;

const props = withDefaults(
  defineProps<{
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: keyof typeof variantClasses;
  }>(),
  {
    label: "",
    loading: false,
    disabled: false,
    type: "button",
    variant: "default",
  }
);

const emit = defineEmits(["click"]);
const isDisabled = computed(() => props.disabled || props.loading);
const variantClass = computed(() => variantClasses[props.variant]);
</script>

<style lang="scss" scoped>
.ui-button--loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-button__content {
  display: contents;
}
</style>
