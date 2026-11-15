<template>
  <section id="addMemory" v-if="isVisible">
    <div class="d-flex w-100 h-100 flex-column align-center" @touchstart.stop>
      <UIButton class="close" label="Закрыть" variant="text" :disabled="isSaving || isPhotoUploading" @click="closeModal" />
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
            <MainCard
              class="mb-8"
              :memory="memoryData"
              :insert-mode="true"
              :photo-loading="isPhotoUploading"
              @onClosedClick="attachPhoto"
            ></MainCard>
            <UIButton
              class="dashed-line addMemory-card__upload"
              variant="text"
              :loading="isPhotoUploading"
              :disabled="isSaving"
            >
              <input
                ref="attachPhotoInput"
                type="file"
                accept="image/jpeg,image/png"
                :disabled="isPhotoUploading || isSaving"
                @input="uploadPhoto"
              >
              <span>Прикрепить фото</span>
            </UIButton>
          </div>
        </div>
        <div class="d-flex justify-center">
          <UIButton
            label="Сохранить"
            variant="cloud-pink"
            style="width: 280px;"
            :disabled="isPhotoUploading"
            :loading="isSaving"
            @click="addMemory"
          />
        </div>
      </div>
    </div>
    <ErrorPopup :message="uploadError" @close="uploadError = ''" />
    <ErrorPopup title="Не удалось сохранить воспоминание" :message="saveError" @close="saveError = ''" />
  </section>
</template>

<script setup lang="ts">
import type { Memory } from '~/types/Memory';

const settingsStore = useSettingsStore();
const spaceStore = useSpaceStore();
const memoriesStore = useMemoriesStore();

const isVisible = computed(() => settingsStore.isAddMemoryModalVisible);
const selectedSpaceId: ComputedRef<number | null> = computed(() => spaceStore.selectedSpaceId);

const attachPhotoInput: Ref<HTMLInputElement | null> = ref(null);
const isPhotoUploading = ref(false);
const uploadError = ref("");
const isSaving = ref(false);
const saveError = ref("");

const memoryData: Ref<Omit<Memory, 'id'>> = ref({
  date: '',
  name: '',
  description: '',
  photo: '',
});

const closeModal = () => {
  if (isSaving.value || isPhotoUploading.value) return;
  settingsStore.isAddMemoryModalVisible = false;
}

const addMemory = async () => {
  const spaceId = selectedSpaceId.value;
  if (!spaceId || isPhotoUploading.value || isSaving.value) return;

  isSaving.value = true;
  saveError.value = "";
  try {
    await useCreateMemory(memoryData.value, spaceId);
    memoryData.value = { date: '', name: '', description: '', photo: '' };
    settingsStore.isAddMemoryModalVisible = false;
    if (selectedSpaceId.value === spaceId) {
      memoriesStore.refreshVersion++;
    }
  } catch (error: any) {
    saveError.value = error?.data?.error?.message || "Попробуйте ещё раз";
  } finally {
    isSaving.value = false;
  }
}

const uploadPhoto = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || isPhotoUploading.value) return;

  isPhotoUploading.value = true;
  uploadError.value = "";
  try {
    const photo = await useLoadPhoto(file);
    if (!photo) throw new Error("Сервер не вернул имя файла");
    memoryData.value.photo = photo;
  } catch (error: any) {
    const apiError = error?.data?.error;
    uploadError.value =
      apiError?.message ||
      (typeof apiError === "string" ? apiError : null) ||
      error?.message ||
      "Проверьте файл и попробуйте ещё раз";
  } finally {
    isPhotoUploading.value = false;
    target.value = "";
  }
}

const attachPhoto = () => {
  if (isSaving.value || isPhotoUploading.value) return;
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
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
