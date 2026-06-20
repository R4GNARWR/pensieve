<template>
  <div class="modal-base__wrap" @touchstart="close" v-if="isVisible">
    <div class="auth-modal__wrap" @touchstart.stop>
      <div class="auth-modal">
        <div class="auth-close" @click="close"></div>
        <div class="auth-modal__content">
          <h2 class="text-center">Добавить участника</h2>

          <div v-if="loading" class="text-center">Загрузка...</div>

          <div v-else-if="users.length === 0" class="text-center">
            Нет пользователей для добавления
          </div>

          <div v-else class="user-list">
            <button
              v-for="user in users"
              :key="user.id"
              class="user-item"
              :class="{ selected: selectedUserId === user.id }"
              @click="selectedUserId = user.id"
            >
              <span class="user-name">{{ user.name }}</span>
              <span class="user-login">@{{ user.username }}</span>
            </button>
          </div>

          <button
            class="btn btn-white-pink"
            :disabled="!selectedUserId"
            @click="addUser"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/User";

const settingsStore = useSettingsStore();
const spaceStore = useSpaceStore();
const isVisible = computed(() => settingsStore.isAddUserModalVisible);

const users = ref<User[]>([]);
const selectedUserId = ref<number | null>(null);
const loading = ref(false);

watch(isVisible, async (val) => {
  if (val) {
    loading.value = true;
    selectedUserId.value = null;
    users.value = await useGetAllUsers();
    loading.value = false;
  }
});

const close = () => {
  settingsStore.isAddUserModalVisible = false;
};

const addUser = async () => {
  if (!selectedUserId.value || !spaceStore.selectedSpaceId) return;
  await useAddUserToSpace(spaceStore.selectedSpaceId, selectedUserId.value);
  close();
};
</script>

<style lang="scss" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: border-color 0.2s;

  &.selected {
    border-color: $pink;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
}

.user-name {
  font-size: rems(18px);
  line-height: 1.2em;
}

.user-login {
  font-size: rems(14px);
  opacity: 0.6;
}
</style>
