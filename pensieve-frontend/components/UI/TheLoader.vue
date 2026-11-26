<template>
  <span class="the-loader"></span>
</template>

<style lang="scss" scoped>
.the-loader {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
  border: 0.12em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: loader-spin 0.7s linear infinite;
}

@keyframes loader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
