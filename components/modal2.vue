<template>
  <div class="modal-two-main">
    <div class="inner-modal" :style="{ padding: data.length > 0 ? '1em 0' : '3em' }">
      <div
        class="total"
      >{{ `Всего ${total} ${total <= 4 && total != 0 ? total == 1 ? 'объект' : 'объекта' : 'объектов'}`.toUpperCase() }}</div>
      <div
        class="more_abs"
        @click.stop="$router.push(`/search/?category=${category_id}`)"
      >ПОСМОТРЕТЬ ЕЩЕ</div>
      <div class="pole_block" v-for="(item, index) in adaptData" :key="index+'pole_block'">
        <div
          class="img"
          :style="{backgroundImage: item.images.length > 0 ? `url(${item.images[0].image})` : '/img/logo.png' }"
        ></div>
        <div class="content">
          <span style="font-size: 1.5em">{{ item.name }}</span>
          <span style="font-size: 1.5em">{{ `от ${item.cost*2} тг/ч` }}</span>
          <span>{{ `Адрес - ${item.location.address.substr(11, item.location.address.length - 1)}` }}</span>
          <span>{{ `Тип - ${item.type=='open' ? 'открытое поле' : 'крытое поле' }` }}</span>
          <span
            style="margin-bottom: 1.5em"
          >{{ `Размеры - ${Math.round(item.length)}х${Math.round(item.width)}м` }}</span>
          <nuxt-link :to="`/playground/${item.id}`" @click.stop>Подробнее</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "category_id", "total"],
  data() {
    return {
      docWidth: 0
    };
  },
  computed: {
    adaptData() {
      if (this.docWidth < 767) {
        return this.data.slice(0, 2);
      } else {
        return this.data;
      }
    }
  },
  beforeMount() {
    this.docWidth = document.documentElement.offsetWidth;
  }
};
</script>
<style scoped>
.modal-two-main {
  margin-left: 3em;

  padding: 2em;

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
  width: 100%;

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
  cursor: pointer;
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
  height: auto;
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
  bottom: 0.25em;
  right: 0;
}

@media (max-width: 767px) {
  .modal-two-main {
    margin: 0;

    width: 100%;

    height: auto;
    padding: 1em 0;

    border-radius: 0;
  }

  .modal-two-main > .inner-modal {
    height: auto;
    padding: 0;
    padding-bottom: 2em;

    border-radius: 0;
  }

  .inner-modal > .pole_block {
    width: 100%;

    padding: 0;
    margin: 0;
    margin-bottom: 1em;
    padding-bottom: 2em;

    position: relative;
  }

  .pole_block > .img {
    height: auto;
  }

  .pole_block > .content {
    padding: 0;

    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .inner-modal > .total {
    font-size: 1rem;
    left: 1em;
    padding: 0 0.1em;
  }

  .inner-modal > .more_abs {
    font-size: 1rem;

    padding: 0.5em 0;

    width: calc(100% + 4px);
    right: -2px;
    bottom: calc(-1em - 2px);
  }

  .content > a {
    bottom: -3em;
    left: -82%;
    right: auto;

    padding: 0.75em 0;
    width: 182%;
    text-align: center;
    text-decoration: none;

    margin: 0;

    background: #064482;
    color: white;
  }
}
</style>

