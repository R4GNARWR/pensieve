<template>
  <section id="diary">
    <div class="index-diary-wrapper">
      <img
        class="index-diary-element-card-1"
        src="/images/png/diaryCard1.png"
        alt="Карточка"
      />
      <img
        class="index-diary-element-card-2"
        src="/images/png/diaryCard2.png"
        alt="Карточка"
      />
      <div class="index-diary">
        <div class="index-diary-book">
          <button class="btn" @click="openDiary">Открыть</button>
          <img src="/images/png/diaryBook.png" alt="" />
        </div>
        <img
          class="index-diary-element-arrow"
          src="/images/svg/diaryArrow.svg"
          alt="Стрелка"
        />
        <img
          class="index-diary-element-key"
          src="/images/png/diaryKey.png"
          alt="Ключ"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const openDiary = () => {
  if (!userStore.user?.id) {
    settingsStore.isAuthModalVisible = true;
  } else {
    navigateTo("/gallery");
  }
};
</script>

<style lang="scss">
@keyframes keyShaking {
  0% {
    transform: translateX(130%) translateY(15%) rotate(-10deg);
  }
  50% {
    transform: translateX(130%) translateY(15%) rotate(5deg);
  }
  100% {
    transform: translateX(130%) translateY(15%) rotate(-10deg);
  }
}

#diary {
  padding-bottom: 35px;
  height: 100dvh;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-bottom: 20px;
    height: auto;
  }
}

.index-diary-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.index-diary {
  z-index: 10;
  position: relative;
}

.index-diary-book {
  width: 570px;
  max-width: 95vw;
  aspect-ratio: 0.75/1;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  button {
    position: absolute;
    left: 50%;
    bottom: 30%;
    transform: translateX(-50%);
    z-index: 10;
    @media (max-width: 768px) {
      $button-padding: rems(15px) rems(50px);
      font-size: rems(40px);
    }
  }
}

.index-diary-element {
  &-card-1 {
    position: absolute;
    left: 3%;
    top: 60%;
    transform: translateY(-50%);
    z-index: 5;
    width: 440px;
    height: 580px;
    object-fit: contain;
    @media (max-width: 768px) {
      display: none;
    }
  }

  &-card-2 {
    position: absolute;
    right: 0;
    top: 140px;
    z-index: 5;
    width: 375px;
    height: 475px;
    object-fit: contain;
    @media (max-width: 768px) {
      display: none;
    }
  }

  &-arrow {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateX(5%);
    z-index: 5;
    width: 300px;
    height: 300px;
    object-fit: contain;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &-key {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateX(130%) translateY(15%);
    z-index: 15;
    width: 300px;
    height: 450px;
    object-fit: contain;
    animation: keyShaking 2.5s infinite;
    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
