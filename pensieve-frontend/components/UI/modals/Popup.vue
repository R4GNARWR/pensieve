<template>
  <dialog
      ref="dialog"
      class="popup"
      :class="`popup--${variant}`"
      @cancel.prevent="emit('close')"
      @click.self="emit('close')"
  >
    <div class="popup__card">
      <h2 v-if="title" class="popup__title">{{ title }}</h2>
      <p class="popup__message">{{ message }}</p>
      <UIButton
          class="popup__button"
          label="Понятно"
          variant="white-pink"
          autofocus
          @click="emit('close')"
      />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type {PopupVariant} from "~/types/Popup";

const props = withDefaults(
    defineProps<{
      message: string;
      title?: string;
      variant?: PopupVariant;
    }>(),
    {
      variant: "error",
    }
);

const emit = defineEmits(["close"]);
const dialog = ref<HTMLDialogElement | null>(null);

watchPostEffect(() => {
  if (props.message) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
});
</script>

<style lang="scss" scoped>
.popup {
  width: min(480px, calc(100% - 48px));
  max-height: calc(100dvh - 48px);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: 24px;
  background: transparent;
  color: $black;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.25);

  &::backdrop {
    background: rgba(0, 0, 0, 0.45);
  }

  &__card {
    padding: 40px;
    border: 4px solid $pink;
    border-radius: 24px;
    background: $blue;
    text-align: center;
  }

  &--success &__card {
    border-color: $white;
  }

  &__title {
    margin-bottom: 16px;
    font-size: rems(30px);
    line-height: 1.15;
  }

  &__message {
    margin-bottom: 20px;
    font-size: rems(28px);
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  &__button {
    padding: rems(8px) rems(24px);
    font-size: rems(24px);
  }

  @media (max-width: 576px) {
    &__card {
      padding: 28px 20px;
    }

    &__title {
      font-size: rems(25px);
    }

    &__message {
      font-size: rems(24px);
    }
  }
}
</style>
