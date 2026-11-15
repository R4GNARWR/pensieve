<template>
  <Teleport to="body">
    <div
      v-if="message"
      class="error-popup"
      role="alert"
      @click.self="emit('close')"
    >
      <div class="error-popup__card">
        <div class="error-popup__title">{{ title }}</div>
        <p class="error-popup__message">{{ message }}</p>
        <UIButton label="Понятно" variant="white-pink" @click="emit('close')" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string;
    title?: string;
  }>(),
  {
    title: "Не удалось загрузить фото",
  }
);

const emit = defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.error-popup {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);

  &__card {
    width: 480px;
    max-width: 100%;
    padding: 40px;
    border: 4px solid $pink;
    border-radius: 24px;
    background: $blue;
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.25);
    text-align: center;
  }

  &__title {
    margin-bottom: 16px;
    font-size: rems(30px);
    line-height: 1.15;
  }

  &__message {
    margin-bottom: 28px;
    font-size: rems(20px);
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  @media (max-width: 576px) {
    &__card {
      padding: 28px 20px;
    }

    &__title {
      font-size: rems(25px);
    }

    &__message {
      font-size: rems(18px);
    }
  }
}
</style>
