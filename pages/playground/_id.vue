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
          <button @click="proceed()" :disabled="booked.length == 0">ЗАБРОНИРОВАТЬ</button>
        </div>
        <div class="inf">
          <div
            class="main_image"
            :style="{backgroundImage: data.images[main_image] ? `url(${data.images[main_image].image})` : 'url(/img/whistle.png)'}"
          ></div>
          <div style="width: 40%">
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Стоимость</span>
              <span class="cost">{{ `от ${data.cost} т` }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Адрес</span>
              <span
                style="width: 60%; min-width: 00%; color: #707070;"
              >{{ `${data.location.address}` }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Время работы</span>
              <span
                style="width: 60%; min-width: 60%; color: #707070;"
              >{{ `${data.time_from_common_days} - ${data.time_to_common_days}` }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Размер</span>
              <span
                style="width: 60%; min-width: 60%; color: #707070;"
              >{{ `${Math.round(data.width)}х${Math.round(data.length)} м` }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Тип покрытия</span>
              <span style="width: 60%; min-width: 60%; color: #707070;">{{ `${data.cover_type}` }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Инфраструктура</span>
              <span style="width: 60%; min-width: 60%; color: #707070;">{{ structure() }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span style="width: 40%; min-width: 40%; color: #707070;">Описание</span>
              <span style="width: 60%; min-width: 60%; color: #707070;">{{ data.description }}</span>
            </div>
            <div style="display: flex; margin-bottom: 1em">
              <span
                style="width: 100%; min-width: 100%; color: #707070;"
              >{{ `Контакты: ${data.phone}` }}</span>
            </div>
          </div>
        </div>
        <div class="inf">
          <div class="images">
            <div
              class="img"
              v-for="(item, index) in data.images"
              :key="'img' + index"
              :style="{marginRight: (index + 1)%5==0 ? '0' : '2.5%', backgroundImage: `url(${item.image})`}"
              :class="{active: main_image==index}"
              @click="main_image=index"
            ></div>
          </div>
          <div class="map">
            <no-ssr>
              <yandex-map
                :coords="[data.location.latitude, data.location.longitude]"
                style="width: 100%; height: 100%;"
                zoom="13"
              >
                <ymap-marker
                  :marker-id="data.location.id"
                  :coords="[data.location.latitude, data.location.longitude]"
                ></ymap-marker>
              </yandex-map>
            </no-ssr>
          </div>
        </div>
        <div class="booking">
          <div class="title">Бронирование</div>
          <table border="1">
            <tr>
              <td
                v-for="(item, index) in shortTable.header"
                :key="'header'+index"
                :class="{'table-button': item.button}"
                @click="pagination(item)"
              >
                <template v-if="item.button">{{ item.title }}</template>
                <template v-else v-for="(title, tindex) in item.title">
                  <div :key="'header' + tindex">{{ title }}</div>
                </template>
              </td>
            </tr>
            <tr v-for="(item, index) in shortTable.result" :key="'result' + index">
              <td
                :class="{
                active: subItem.active && !subItem.is_booked, 
                booked: subItem.is_booked, 
                book: subItem.id && !subItem.is_booked
              }"
                v-for="(subItem, subIndex) in item"
                :key="subItem.id + 'td' + subIndex"
                @click="book(subItem, subItem.arrayCoor)"
              >{{ subItem.title }}</td>
            </tr>
          </table>
        </div>
        <transition-group name="page" class="booked">
          <span style="transition: 0.5s" v-if="booked.length > 0" key="'booked_time'">
            <span>{{ `Дата: ${booked[0].date}; Время: ${booked[0].from_time}-${booked[booked.length-1].to_time}` }}</span>
          </span>
          <span
            key="pretotal"
            style="margin-top: 1em; font-size: 1.5em; transition: 0.5s"
          >{{ `Итоговая стоимость: ${price.total} т` }}</span>
          <span
            key="prepre"
            style="transition: 0.5"
          >{{ `Предоплата ${data.prepay}%: ${price.pre} т` }}</span>
        </transition-group>
      </div>
    </transition>
  </div>
</template>
<script>
import createTable from "~/service/booking.js";

export default {
  async asyncData({ store, params }) {
    try {
      await store.dispatch("getPlaycategories");
      await store.dispatch("getPlayground", params.id);

      let data = JSON.parse(JSON.stringify(store.state.playground));
      let category = store.state.playcategories.find(
        item => item.id == data.category
      );

      let table = createTable(data.days);

      return {
        data,
        category,
        main_image: 0,
        table,
        booked: [],
        page: 1
      };
    } catch (error) {
      throw error;
    }
  },
  head() {
    return {
      title: this.data.name + " | Онлайн бронирование спортивных площадок"
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    price() {
      let price = { total: 0, pre: 0 };
      this.booked.forEach(item => {
        price.total += item.price;
      });

      price.pre = Math.round((price.total / 100) * this.data.prepay);

      return price;
    },

    shortTable() {
      let result = JSON.parse(JSON.stringify(this.table.result));
      let header = this.table.header.slice(this.page, this.page + 7);

      if (header.length == 7) {
        header.push(this.table.header[this.table.header.length - 1]);
      }

      header.unshift(this.table.header[0]);

      for (let i = 0; i < result.length; i++) {
        let subArray = result[i].slice(this.page, this.page + 7);

        if (subArray.length == 7) {
          subArray.push(result[i][result[i].length - 1]);
        }

        subArray.unshift(result[i][0]);

        result[i] = subArray;
      }

      return { header, result };
    }
  },
  methods: {
    pagination(item) {
      if (!item.button) return;

      if (item.title == "Назад") {
        if (this.page - 7 >= 1) {
          this.page -= 7;
        }
      } else {
        if (this.page + 7 < this.table.header.length) {
          this.page += 7;
        }
      }
    },

    book(item, position) {
      if (!item.id || item.is_booked) return;

      let { x, y } = position;
      let table = this.table.result;

      table[x][y].active = !table[x][y].active;
      if (table[x + 1] && !table[x + 1][y].is_booked) {
        table[x + 1][y].active = !table[x + 1][y].active;
      }

      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
          if (table[i][j].active && j != y) {
            table[i][j].active = !table[i][j].active;
          }
        }
      }

      this.booked = [];
      for (let i = 0; i < table.length; i++) {
        if (table[i][y].active) {
          this.booked.push(table[i][y]);
        }
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
    },

    async proceed() {
      let booked = JSON.stringify(this.booked);
      document.cookie = `booked=${booked}`;

      if (this.user.id) {
        let book_windows = this.booked.map(item => {
          return { window: item.id, date: item.date };
        });

        let payload = { book_windows, playground: this.data.id };
        try {
          let response = await this.$store.dispatch("Book", payload);
          document.cookie = `order_id=${response.book_windows[0].booking}`;

          this.$router.push(`/book?playground=${this.data.id}`);
        } catch (error) {
          alert(error + "\n Попробуйте позже");
        }
      } else {
        this.$store.commit("setModals", { login: true, register: false });
      }
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
  width: 58%;
  max-width: 58%;

  height: 35em;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  /* border-radius: 12px; */
}

.inf > .images {
  display: block;

  width: 58%;
  max-width: 58%;
}

.inf > .active {
  border: solid 1px #064482;
}

.inf > .map {
  width: 40%;
  height: 22em;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  border-radius: 36px;

  overflow: hidden;
}

.images > .img {
  height: 7em;
  width: 18%;

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

td.table-button {
  background-color: #074582;
  color: white;

  cursor: pointer;
}

td.table-button:hover {
  background-color: #4b80b4;
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

@media (max-width: 767px) {
  .playground_main {
    padding: 0;
  }

  .playground_main > .logo {
    margin: 0;
    font-size: 4em;
  }

  .playground_main > .body {
    padding: 2em 0;
  }

  .body > .title {
    left: 1em;
  }

  .body > .inf {
    flex-direction: column;
  }

  .inf > div {
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style>
