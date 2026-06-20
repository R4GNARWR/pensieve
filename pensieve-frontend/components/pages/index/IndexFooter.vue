<template>
  <footer></footer>
</template>

<script setup lang="ts"></script>

<style lang="scss">
footer {
  height: 400px;
  width: 100%;
  background-image: url("/images/png/footerTexture.png");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 100% auto;
  @media (max-width: 1200px) {
    height: 200px;
  }
}
</style>
