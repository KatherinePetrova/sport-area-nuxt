<template>
  <transition name="shade">
    <div class="loading-page" v-if="loading">
      <img src="/img/loading.gif" />
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.shade-enter-active,
.shade-leave-active {
  transition: opacity 0.5s;
}
.shade-enter,
.shade-leave-to {
  opacity: 0;
}

html,
body {
  overflow: hidden;
}

.loading-page {
  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.9);

  text-align: center;

  z-index: 999999;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
