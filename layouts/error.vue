<template>
  <div class="error-main">
    <img src="/logo.png" />
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <h1 v-else>Возникла ошибка :(</h1>
    <div>
      попробуйте
      <a href="#" @click.prevent @click="$router.go(-1)">вернуться назад</a>
      или
      <nuxt-link to="/">на главную страницу</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  props: ["error"]
};
</script>

<style scoped>
.error-main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 10em;
}

@media (max-width: 767px) {
  .error-main {
    padding: 1em;
  }
}
</style>
