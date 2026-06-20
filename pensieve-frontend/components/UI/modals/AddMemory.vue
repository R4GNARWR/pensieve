<template>
  <section id="addMemory" v-if="isVisible">
    <div class="d-flex w-100 h-100 flex-column align-center" @touchstart.stop>
      <button class="close" @click="closeModal">
        Закрыть
      </button>
      <div class="addMemory-card">
        <div class="d-flex addMemory-card__wrap justify-between flex-grow-1 ga-8">
          <div class="addMemory-card__desk ga-4">
            <div class="addMemory-card__desk-title">Добавь воспоминание</div>
            <div class="d-flex ga-3 align-center addMemory-card__desk-text">
              <span>Дата:</span>
              <div class="flex-grow-1 dashed-line">
                <input v-model="memoryData.date" class="clear-input w-100" type="date">
              </div>
            </div>
            <div class="d-flex ga-3 align-center addMemory-card__desk-text">
              <span>Событие:</span>
              <div class="flex-grow-1 dashed-line">
                <input v-model="memoryData.name" class="clear-input w-100" maxlength="45" type="text">
              </div>
            </div>
            <div class="d-flex flex-column addMemory-card__desk-text">
              <span>Описание:</span>
              <div class="flex-grow-1">
                <textarea v-model="memoryData.description" rows="4" maxlength="145" class="lined-textarea w-100"
                  type="text"></textarea>
              </div>
            </div>
          </div>
          <div class="addMemory-card__photo flex-shrink-0">
            <MainCard class="mb-8" @onClosedClick="attachPhoto" :memory="memoryData" :insert-mode="true"></MainCard>
            <button class="dashed-line"><input ref="attachPhotoInput" type="file" @input="uploadPhoto">Прикрепить
              фото</button>
          </div>
        </div>
        <div class="d-flex justify-center">
          <button class="btn-cloud btn-cloud-pink" style="width: 280px;" @click="addMemory">Сохранить</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Memory } from '~/types/Memory';

const settingsStore = useSettingsStore();
const spaceStore = useSpaceStore();

const isVisible = computed(() => settingsStore.isAddMemoryModalVisible);
const selectedSpaceId: ComputedRef<number | null> = computed(() => spaceStore.selectedSpaceId);

const attachPhotoInput: Ref<HTMLInputElement | null> = ref(null);

const memoryData: Ref<Omit<Memory, 'id'>> = ref({
  date: '',
  name: '',
  description: '',
  photo: '',
});

const closeModal = () => {
  settingsStore.isAddMemoryModalVisible = false;
}

const addMemory = async () => {
  if (memoryData.value && selectedSpaceId.value) {
    const response = await useCreateMemory(memoryData.value, selectedSpaceId.value);
    if (response.success) {
      settingsStore.isAddMemoryModalVisible = false;
      useGetMemories(selectedSpaceId.value)
    } else {
      alert(response.data);
    }
  }
}

const uploadPhoto = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target || !target.files || target.files.length === 0) {
    console.log('No target or files');
    return;
  }
  const file = target.files[0];
  // @ts-ignore
  memoryData.value.photo = await useLoadPhoto(file);
}

const attachPhoto = () => {
  attachPhotoInput.value?.click();
}
</script>

<style lang="scss">
#addMemory {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close {
  cursor: pointer;
  font-size: rems(32px);
  line-height: 2.25em;
  position: relative;

  @media (max-width: 768px) {
    font-size: rems(24px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -30px;
    transform: translateY(-50%);
    width: 19px;
    height: 26px;
    background: url('/images/svg/close-dark.svg') no-repeat right;
  }
}

.addMemory-card {
  max-width: 1300px;
  width: 100%;
  height: 100%;
  background-image: url('/images/png/addMemory_back.png');
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
  padding: 110px 120px 110px 180px;

  @media (max-width: 991px) {
    padding: 24px;
    background-image: none;
    overflow-y: scroll;
    scrollbar-width: thin;
  }

  &__wrap {
    flex-direction: row;

    @media (max-width: 991px) {
      flex-direction: column
    }
  }

  // .addMemory-card__desk
  &__desk {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    &-title {
      font-size: rems(40px);

      @media (max-width: 768px) {
        font-size: rems(32px);
        text-align: center;
      }
    }

    &-text {
      font-size: rems(36px);

      @media (max-width: 768px) {
        font-size: rems(20px);
      }
    }
  }

  // .addMemory-card__photo
  &__photo {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 991px) {
      width: 100%;
      max-width: 300px;
      margin: 0 auto 30px auto;
    }

    @media (max-width: 576px) {
      max-width: 240px;
    }

    button {
      position: relative;
      font-size: rems(36px);
      color: inherit;
      text-decoration: none;

      @media (max-width: 768px) {
        font-size: rems(24px);
      }

      input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.01;
        cursor: pointer;
      }
    }
  }
}

@media (max-width: 1400px) {
  .addMemory-card {
    max-width: 100%;
  }
}
</style>