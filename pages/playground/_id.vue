<template>
  <div class="playground_main">
    <div
      class="logo"
      :style="{backgroundImage: `url(${playcategories.find(item => item.id == $route.params.id).photo})`}"
    >{{ }}</div>
  </div>
</template>
<script>
export default {
  async fetch({ store, params }) {
    await store.dispatch("getPlaycategories");
  },
  computed: {
    playcategories() {
      return this.$store.state.playcategories;
    }
  }
};
</script>
<style scoped>
.playground_main {
  width: 100%;

  font-size: 14px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 1em 3em;
}

.playground_main > .logo {
  height: 2em;
  width: 100%;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  border-radius: 39px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

  font-size: 3em;

  padding: 0 0.5em;

  display: flex;
  align-items: center;

  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  /* font-family: "Century Gothic"; */
  font-size: 119px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #ffffff;

  margin: 0.1em 0;
}
</style>
