<template>
  <div class="playground_main">
    <div
      v-if="category"
      class="logo"
      :style="{backgroundImage: `url(${category.photo})`}"
    >{{ category.name.toUpperCase() }}</div>
    <transition name="page">
      <div class="body">
        <div class="title">{{ data.name }}</div>
        <div class="book_button">
          <button>Сделать предоплату</button>
        </div>
        <div class="inf">
          <div
            class="main_image"
            :style="{backgroundImage: data.images[main_image] ? `url(${data.images[main_image].image})` : 'url(/img/whistle.png)'}"
          ></div>
          <div style="width: 48%">
            <span style="margin-bottom: 1em">Дата и время брони</span>
            <b-form-input></b-form-input>
          </div>
        </div>
        <div class="inf">
          <div class="images">Адрес</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import createTable from "~/service/booking.js";

export default {
  async asyncData({ store, query }) {
    await store.dispatch("getPlaycategories");
    await store.dispatch("getPlayground", query.playground);

    let data = JSON.parse(JSON.stringify(store.state.playground));
    let category = store.state.playcategories.find(
      item => item.id == data.category
    );

    return {
      data,
      category,
      main_image: 0
    };
  },
  head() {
    return {
      title: this.data.name + " | Онлайн бронирование спортивных площадок"
    };
  },
  computed: {
    price() {
      let price = { total: 0, pre: 0 };
      this.booked.forEach(item => {
        price.total += item.price;
      });

      price.pre = Math.round((price.total / 100) * this.data.prepay);

      return price;
    }
  },
  methods: {
    book(item) {
      if (!item.id || item.is_booked) return;

      item.active = !item.active;
      if (item.active) {
        this.booked.push(item);
      } else {
        let index = this.booked.findIndex(el => el.id == item.id);
        this.booked.splice(index, 1);
      }
    },
    unbook(item) {
      let { x, y } = item.arrayCoor;
      this.table.result[x][y].active = false;

      let index = this.booked.findIndex(el => el.id == item.id);
      this.booked.splice(index, 1);
    },
    structure() {
      let result = "";
      for (let key in this.data) {
        if (key.includes("is") && this.data[key]) {
          result += key.substr(3, key.length) + ", ";
        }
      }

      return result.substr(0, result.length - 2);
    }
  },
  mounted() {
    window.scrollTo({ top: 300, behavior: "smooth" });
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

  margin-bottom: 3em;
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

.playground_main > .body {
  margin-top: 2em;

  padding: 3em 2em;

  width: 100%;

  border-radius: 39px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;
}

.body > .title {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #064482;

  font-size: 3em;
  padding: 0 0.5em;

  background-color: white;

  position: absolute;
  top: -0.6em;
  left: 3em;
}

.body > .book_button {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;

  background-color: white;
  color: black;

  position: absolute;
  bottom: -1em;
  left: calc(50% - (1em + 3.5em + 2em));

  padding: 0 1em;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5em;
}

.book_button > button {
  background-color: #064482;
  color: white;

  border: none;

  padding: 0.75em 3.5em;

  border-radius: 5px;
}

.body > .inf {
  width: 100%;

  display: flex;
  justify-content: space-between;

  margin-bottom: 3em;
  color: #064482 !important;
}

.body > .booked {
  width: 100%;

  display: flex;
  flex-direction: column;

  color: #064482;

  padding: 0.5em 1em;
  font-size: 2em;

  position: relative;
}

.body > .booking {
  width: 100%;

  padding: 2em 1em;

  border-radius: 29px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;
}

.booking > .title {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #064482;

  font-size: 2em;
  padding: 0 0.5em;

  background-color: white;

  position: absolute;
  top: -0.6em;
  left: 3em;
}

.inf > .main_image {
  width: 50%;
  max-width: 50%;

  height: 35em;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.inf > .images {
  display: block;

  width: 50%;
  max-width: 50%;
}

.inf > .active {
  border: solid 1px #064482;
}

.inf > .map {
  width: 48%;
  height: 22em;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  border-radius: 36px;
}

.images > .img {
  height: 10em;
  width: 30%;

  float: left;

  margin-right: 5%;
  margin-bottom: 2em;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  background-image: url("/img/pole1.jpg");

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

  cursor: pointer;

  transition: 1s;
}

.images > .img:hover {
  box-shadow: 0 13px 16px 0 rgba(0, 0, 0, 0.8);
}

.images > .active {
  border: solid 1px #064482;
}

.cost {
  width: 60%;
  min-width: 60%;
  backdrop-filter: blur(30px);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  color: #074582;
  font-size: 3em;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.19;
  letter-spacing: normal;
}

table {
  width: 100%;
  table-layout: fixed;
  border: solid 1px #e8e7e7;
  text-align: center;

  font-size: 16px;
}

td {
  width: auto;

  padding: 1em 0;
  text-align: center;

  color: #074582;
}

td.book {
  cursor: pointer;
}

td.book:hover {
  background-color: rgba(0, 0, 0, 0.16);
}

td.active {
  background-color: #bbffbb;
}

td.booked {
  background-color: #ffbbbb;
  color: #0745822f;
}
</style>
