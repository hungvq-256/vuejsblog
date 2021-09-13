<template>
  <div class="loading">
    <div class="loading__icon" :style="setSize"></div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    size: {
      type: Number,
      default: 25,
    },
  },
  computed: {
    setSize() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.loading {
  &__icon {
    width: 25px;
    height: 25px;
    margin: 0 auto;
    border: 3px solid $text-cl;
    border-radius: 50%;
    border-right-color: transparent;
    border-left-color: transparent;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>