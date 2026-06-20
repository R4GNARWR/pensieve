<template>
  <section id="indexLetter" ref="letterSection">
    <div class="index-letter__main">
      <img src="/images/png/indexLetterMainFront.png" alt="" />
      <div class="index-letter__main-idea__wrapper">
        <div class="index-letter__main-idea vintage-paper" ref="letterIdea">
          <h2 class="index-letter__main-idea__label">Идея</h2>
          <p class="index-letter__main-idea__text">
            Создайте личный онлайн-дневник, где вы и ваш партнёр сможете
            записывать и хранить ваши совместные воспоминания на протяжении
            всего года.
            <br />
            В конце года все записи и фотографии станут доступны для просмотра и
            совместного наслаждения. Это уникальный способ сохранить самые
            ценные моменты ваших отношений.
          </p>
        </div>
      </div>
    </div>
    <img
      class="index-letter__element-1"
      src="/images/png/indexLetterPen.png"
      alt=""
    />
    <img
      class="index-letter__element-2"
      src="/images/png/indexLetterPendant.png"
      alt=""
    />
  </section>
</template>

<script setup lang="ts">
const letterIdea = ref<HTMLElement | null>(null);
const letterSection = ref<HTMLElement | null>(null);

const setLetterIdeaPadding = () => {
  if (window.innerWidth < 576) {
    letterSection.value!.style.padding = "80px 0";
    return;
  }
  if (letterIdea.value && letterSection.value) {
    let letterIdeaHeight = letterIdea.value.offsetHeight / 2;
    letterSection.value.style.paddingTop = `${letterIdeaHeight}px`;
  }
};

onMounted(() => {
  setLetterIdeaPadding();
  window.addEventListener("resize", setLetterIdeaPadding);
});

onUnmounted(() => {
  window.removeEventListener("resize", setLetterIdeaPadding);
});
</script>

<style lang="scss">
@keyframes animateLetter {
  0% {
    transform: translateY(250px);
  }

  100% {
    transform: translateY(100px);
  }
}

#indexLetter {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.index-letter__main {
  position: relative;
  max-width: 827px;
  width: 100%;
  height: 559px;
  overflow: visible;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    object-fit: contain;
    object-position: bottom center;
    z-index: 20;

    @media (max-width: 576px) {
      display: none;
    }
  }

  @media (max-width: 960px) {
    padding: 0 20px;

    img {
      width: calc(100% - 40px);
      left: 20px;
    }
  }
  @media (max-width: 576px) {
    height: auto;
  }
}

.index-letter__main-idea__wrapper {
  padding-top: 1000px;
  margin-top: -1000px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  z-index: 5;

  @media (max-width: 960px) {
    width: calc(100% - 40px);
    left: 20px;
  }

  @media (max-width: 576px) {
    padding-top: 0;
    margin-top: 0;
    position: static;
    height: auto;
    width: 100%;
  }
}

.index-letter__main-idea {
  padding: 80px 120px 500px 120px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  transform: translateY(0);
  z-index: 10;
  text-align: center;
  animation: animateLetter linear 2s forwards;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 20px 500px 20px;
  }

  @media (max-width: 576px) {
    padding: 60px 20px 80px 20px;
    position: static;
    width: 100%;
    animation: none;
  }

  // .index-letter__main-idea__label
  &__label {
    margin-bottom: rems(30px);
    font-size: rems(48px);
    line-height: 1em;
    @media (max-width: 768px) {
      font-size: rems(36px);
    }
  }

  // .index-letter__main-idea__text
  &__text {
    font-size: rems(32px);
    line-height: 1em;
    text-wrap: balance;
    @media (max-width: 768px) {
      font-size: rems(28px);
    }
  }
}

.index-letter__element-1 {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-40%) translateX(10%);
  width: 570px;
  height: 680px;
  object-fit: contain;
  z-index: 30;
  @media (max-width: 960px) {
    display: none;
  }
}

.index-letter__element-2 {
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(20%);
  width: 1000px;
  height: 1000px;
  object-fit: contain;
  z-index: 30;
  @media (max-width: 960px) {
    display: none;
  }
}
</style>
