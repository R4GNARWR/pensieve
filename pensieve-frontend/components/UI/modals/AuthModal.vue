<template>
  <div class="modal-base__wrap" @touchstart="closeModal" v-if="isVisible">
    <div
      class="auth-modal__wrap"
      :class="{ big: currentTab === 'login' }"
      @touchstart.stop
    >
      <div class="auth-modal">
        <div class="auth-close" @click="closeModal"></div>
        <div class="auth-modal__content">
          <template v-if="currentTab === ''">
            <button
              class="btn-auth text-primary-pink"
              @click="currentTab = 'registration'"
            >
              Регистрация
            </button>
            <span>Или</span>
            <button
              class="btn-auth text-primary-pink mb-0"
              @click="currentTab = 'login'"
            >
              Вход
            </button>
          </template>
          <template v-if="currentTab === 'registration'">
            <h2 class="text-center">Регистрация</h2>
            <TheInput
              class="text-center"
              placeholder="Логин"
              v-model="username"
            ></TheInput>
            <TheInput
              class="text-center"
              placeholder="Ваше имя"
              v-model="name"
            ></TheInput>
            <TheInput
              class="text-center"
              placeholder="Пароль"
              type="password"
              v-model="password"
            ></TheInput>
            <button class="btn btn-white-pink" @click="register">
              Отправить
            </button>
          </template>
          <template v-if="currentTab === 'login'">
            <h2 class="text-center">Вход</h2>
            <TheInput placeholder="Логин" v-model="username"></TheInput>
            <TheInput
              placeholder="Пароль"
              v-model="password"
              type="password"
            ></TheInput>
            <button class="btn btn-white-pink" @click="authorize">
              Отправить
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const currentTab = ref("");
const username = ref("");
const password = ref("");
const name = ref("");
const isVisible = computed(() => useSettingsStore().isAuthModalVisible);

const closeModal = () => {
  useSettingsStore().isAuthModalVisible = false;
  currentTab.value = "";
};

const authorize = () => {
  useAuthenticateUser({
    username: username.value,
    password: password.value,
  });
};

const register = () => {
  useRegisterUser({
    name: name.value,
    username: username.value,
    password: password.value,
  });
};
</script>

<style lang="scss">
@use "sass:color";
.auth-modal {
  padding: 2px 110px;
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("/images/png/auth-back-base.png") 100% repeat;
  @media (max-width: 768px) {
    padding: 100px 20px;
    border-radius: 20px;
    border: 10px solid color.adjust($color: $blue, $lightness: 9%);
    background: $blue;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    transform: translate(0, -100%);
    width: 100%;
    height: 95px;
    background: url("/images/png/auth-back-before.png") bottom/100% no-repeat;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: calc(100% - 2px);
    width: 100%;
    height: 90px;
    background: url("/images/png/auth-back-after.png") top/100% no-repeat;
    @media (max-width: 768px) {
      display: none;
    }
  }

  span {
    font-size: rems(20px);
    line-height: 1em;
    text-align: center;
  }

  h2,
  .btn-auth {
    font-size: rems(48px);
    line-height: 1em;
  }

  &__content {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    row-gap: 32px;
  }
}

.auth-modal__wrap {
  width: 636px;
  max-width: 100%;
  height: auto;
  @media (max-width: 768px) {
    max-width: 90%;
  }
}

.auth-close {
  background: url("/images/svg/close.svg") no-repeat right;
  width: 38px;
  height: 53px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, calc(-100% - 80px));
  cursor: pointer;

  @media (max-width: 768px) {
    transform: translate(-50%, calc(-100% + 80px));
  }
}
</style>
