<template>
  <section id="indexSupport">
    <img
      class="index-support-element-1"
      src="/images/png/indexSupportFlower.png"
      alt=""
    />
    <div class="index-support-main">
      <div class="index-support-main__text">
        Если вам понравился наш проект, вы можете поддержать его развитие. Ваша
        помощь поможет нам улучшать функционал и развивать сайт.
      </div>
    </div>
    <img
      class="index-support-element-2"
      src="/images/png/indexSupportCoffee.png"
      alt=""
    />
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss">
#indexSupport {
  padding: 300px 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1200px) {
    padding: 200px 0;
  }
  @media (max-width: 768px) {
    padding: 0 0 100px 0;
  }
}

.index-support-main {
  padding: 95px 60px;
  width: 784px;
  height: 415px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/images/png/indexSupportFrame.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  transform: rotate(-7deg);

  // .index-support-main__text
  &__text {
    font-size: rems(36px);
    line-height: 1.1em;
    text-align: center;

    @media (max-width: 768px) {
      font-size: rems(32px);
      line-height: 1.2em;
      padding: 0 20px;
    }

    @media (max-width: 576px) {
      font-size: rems(16px);
      line-height: 1.2em;
      padding: 0 20px;
    }
  }
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
}

.index-support-element-1 {
  position: absolute;
  left: 0;
  top: 0;
  width: 650px;
  height: 700px;
  transform: rotate(15deg);
  object-fit: contain;
}
.index-support-element-2 {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(10%);
  width: 496px;
  aspect-ratio: 1/1;
  object-fit: contain;
  object-position: right center;
  @media (max-width: 1600px) {
    width: 350px;
  }
  @media (max-width: 1200px) {
    width: 300px;
  }
  @media (max-width: 768px) {
    width: 250px;
  }
}
</style>
