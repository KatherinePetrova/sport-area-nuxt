<template>
  <div class="modal-two-main">
    <div class="inner-modal">
      <div class="total">{{ `Всего ${total} объекта`.toUpperCase() }}</div>
      <div
        class="more_abs"
        @click.stop="$router.push(`/search?category=${category_id}`)"
      >ПОСМОТРЕТЬ ЕЩЕ</div>
      <div class="pole_block" v-for="(item, index) in data" :key="index+'pole_block'">
        <div
          class="img"
          :style="{backgroundImage: item.images.length > 0 ? `url(${item.images[0].image})` : '/img/logo.png' }"
        ></div>
        <div class="content">
          <span style="font-size: 1.5em">{{ item.name }}</span>
          <span style="font-size: 1.5em">{{ `от ${item.cost} тг/ч` }}</span>
          <span>{{ `Адрес - ${item.location.address}` }}</span>
          <span>{{ `Тип - ${item.type}` }}</span>
          <span>{{ `Размеры - ${Math.round(item.length)}х${Math.round(item.width)} м` }}</span>
          <a :href="`/playground/${item.id}`" @click.stop>Подробнее</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "category_id", "total"]
};
</script>
<style scoped>
.modal-two-main {
  margin-top: 0.5rem;
  margin-left: 3rem;
  margin-bottom: 3em;

  height: 25rem;
  width: 80%;

  border-radius: 30px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #707070;
  background-color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-two-main > .inner-modal {
  height: 80%;
  width: 90%;

  border-radius: 15px;
  border: solid 1px #1e568e;

  position: relative;
  padding: 0.5em;
}

.inner-modal > .total {
  position: absolute;

  color: #1e568e;
  font-weight: bold;
  text-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
  line-height: 1.21;
  font-size: 1.5em;

  padding: 0 0.5em;

  top: -0.75em;
  right: 1.75em;

  background-color: #ffffff;
}

.inner-modal > .more_abs {
  position: absolute;

  background-color: #1e568e;

  font-weight: bold;
  font-size: 1.5em;
  color: white;

  bottom: -0.75em;
  right: 1.75em;

  padding: 0 0.5em;
}

.inner-modal > .more_abs:hover {
  box-shadow: 0 10px 12px 0 rgba(0, 0, 0, 0.3);
}

.inner-modal > .pole_block {
  height: 40%;
  width: 45%;

  backdrop-filter: blur(30px);
  box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;

  float: left;

  margin: 1.2em 1.05em 0 1.05em;
  z-index: 1;

  padding: 0.5em;

  display: flex;
  justify-content: space-between;
}

.pole_block > .img {
  height: 100%;
  width: 40%;

  background-image: url("/img/pole1.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.pole_block > .content {
  height: 100%;
  width: 55%;

  color: #064482;
  font-size: 0.6rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;

  padding-right: 1em;

  position: relative;
}

.content > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  max-width: 100%;
}

.content > a {
  text-decoration: underline;
  color: #064482;
  font-size: 1.1em;

  position: absolute;
  bottom: 0;
  right: 0;
}
</style>

