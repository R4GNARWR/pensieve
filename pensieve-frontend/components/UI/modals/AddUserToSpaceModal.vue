<template>
  <dialog ref="dialog" class="modal-base__wrap add-user-dialog" @cancel.prevent="close" @touchstart.self="close">
    <div class="auth-modal__wrap">
      <div class="auth-modal">
        <UIButton class="auth-close" title="Закрыть форму" variant="icon" autofocus :disabled="submitting"
                  @click="close"/>
        <form class="auth-modal__content" @submit.prevent="addUser">
          <h2 class="text-center">Добавить участника</h2>

          <div>
            <label for="space-member-email">Email участника</label>
            <TheInput
                id="space-member-email"
                name="email"
                type="email"
                v-model="email"
            />
          </div>

          <p v-if="errorMessage">{{ errorMessage }}</p>

          <UIButton
            label="Добавить"
            variant="white-pink"
            type="submit"
            :disabled="!email.trim() || !spaceStore.selectedSpaceId"
            :loading="submitting"
          />
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore();
const spaceStore = useSpaceStore();
const dialog = ref<HTMLDialogElement | null>(null);
const isVisible = computed(() => settingsStore.isAddUserModalVisible);

const email = ref("");
const errorMessage = ref("");
const submitting = ref(false);

watch(isVisible, (visible) => {
  if (visible) {
    email.value = "";
    errorMessage.value = "";
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
}, {flush: "post"});

const close = () => {
  if (submitting.value) return;
  settingsStore.isAddUserModalVisible = false;
};

const addUser = async () => {
  const spaceId = spaceStore.selectedSpaceId;
  const address = email.value.trim();
  if (!spaceId || !address || submitting.value) return;

  submitting.value = true;
  errorMessage.value = "";
  try {
    await useAddUserToSpace(spaceId, address);
    settingsStore.isAddUserModalVisible = false;
  } catch (error: any) {
    errorMessage.value = error.data?.error?.message || "Не удалось добавить участника. Попробуйте ещё раз.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.add-user-dialog {
  max-width: none;
  max-height: none;
  padding: 0;
  border: 0;
  background: transparent;

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background: rgb(0 0 0 / 15%);
  }
}
</style>
