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
        <div class="book_button" v-if="user && user.id == data.owner">
          <button @click="ownerBook = true" :disabled="booked.length == 0">РУЧНАЯ БРОНЬ</button>
          <b-modal v-model="ownerBook" hide-footer hide-header>
            <b-form @submit.prevent="proceedAsOwner">
              <label style="margin-botom: 1em">Клиент</label>
              <b-form-input placeholder="Имя клиента" v-model="user_info.name"></b-form-input>
              <b-form-input
                placeholder="Телефон клиента"
                v-model="user_info.phone"
                v-mask="'+7 (###) ### ## ##'"
              ></b-form-input>
              <b-button type="submit" style="margin-top: 1em">Подтвердить</b-button>
            </b-form>
          </b-modal>
        </div>
        <div class="book_button" v-else>
          <button @click="proceed()" :disabled="booked.length == 0">ЗАБРОНИРОВАТЬ</button>
        </div>

        <template v-if="!$route.query.owner_book">
          <div class="inf">
            <div
              class="main_image"
              :class="{'full-screen': full_screen}"
              :style="{backgroundImage: data.images[main_image] ? `url(${data.images[main_image].image})` : 'url(/img/whistle.png)'}"
            >
              <b-button
                class="image-arrow"
                style="left: 1em"
                @click="main_image--"
                :disabled="main_image <= 0"
              >
                <img src="/img/left-arrow.png" alt />
              </b-button>
              <b-button
                class="image-arrow"
                style="right: 1em"
                @click="main_image++"
                :disabled="main_image >= data.images.length -1"
              >
                <img src="/img/right-arrow.png" alt />
              </b-button>
              <b-button
                @click="full_screen = !full_screen"
              >{{ full_screen ? 'Вернуть' : 'Развернуть' }}</b-button>
            </div>
            <div class="information">
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Стоимость</span>
                <span class="cost">{{ `от ${data.cost*2} т` }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Адрес</span>
                <span
                  style="width: 60%; min-width: 00%; color: #707070;"
                >{{ `${data.location.address.substr(11, data.location.address.length - 1)}` }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Время работы</span>
                <span style="width: 60%; min-width: 60%; color: #707070;">
                  <!-- {{ "Будние: " + (Math.abs(parseInt(data.work_time_from_common_days.split(":").join()) - parseInt(data.work_time_to_common_days.split(":").join())) > 1 ? `${data.work_time_from_common_days} - ${data.work_time_to_common_days}` : "круглосуточно") }}
                  <br />
                  {{ "Выходные: " + (Math.abs(parseInt(data.work_time_from_holiday_days.split(":").join()) - parseInt(data.work_time_to_holiday_days.split(":").join())) > 1 ? `${data.work_time_from_holiday_days} - ${data.work_time_to_holiday_days}` : "круглосуточно") }}-->
                  <label v-for="(item, index) in workTime" :key="'workTime' + index">
                    {{ item }}
                    <br />
                  </label>
                </span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Размер</span>
                <span
                  style="width: 60%; min-width: 60%; color: #707070;"
                >{{ `${Math.round(data.width)}х${Math.round(data.length)} м` }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Тип покрытия</span>
                <span style="width: 60%; min-width: 60%; color: #707070;">{{ `${data.cover_type}` }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Инфраструктура</span>
                <span style="width: 60%; min-width: 60%; color: #707070;">{{ structure() }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Описание</span>
                <span style="width: 60%; min-width: 60%; color: #707070;">{{ data.description }}</span>
              </div>
              <div>
                <span style="width: 40%; min-width: 40%; color: #707070;">Контакты</span>
                <span style="width: 60%; min-width: 60%; color: #707070;">{{ data.phone }}</span>
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
              >
                <b-button
                  @click="full_screen = !full_screen"
                  style="background-color: rgba(0, 0, 0, 0.5)"
                >{{ full_screen ? 'Вернуть' : 'Развернуть' }}</b-button>
              </div>
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
                    :icon="{ 
                      imageHref: '/img/marker.png', 
                      layout: 'default#imageWithContent', 
                      imageSize: [28, 33],
                      imageOffset: [-14, -16], 
                    }"
                  ></ymap-marker>
                </yandex-map>
              </no-ssr>
            </div>
          </div>
        </template>
        <div class="booking">
          <div class="title">Бронирование</div>
          <div class="legend">
            <div>
              <div class="color" style="background-color: #bbffbb"></div>
              <div class="text">- забронировано вами</div>
            </div>
            <div>
              <div class="color" style="background-color: #ffbbbb"></div>
              <div class="text">- забронировано и оплачено</div>
            </div>
            <div>
              <div class="color" style="background-color: rgba(255, 237, 5, 0.5)"></div>
              <div class="text">- ожидается оплата</div>
            </div>
          </div>
          <div class="mobile-table">
            <label style="color: #064482; margin: 0">Выберите дату</label>
            <b-form-input
              type="date"
              v-model="mobileModel"
              :min="table.header[1].date"
              :max="table.header[table.header.length - 2].date"
            ></b-form-input>
            <transition-group class="table" v-if="mobileModel">
              <div class="title" key="title">{{ mobileTable.title }}</div>
              <div
                @click="book(item, item.arrayCoor)"
                :class="{
                  active: item.active && !item.is_booked, 
                  'booked-color': item.is_booked && item.is_paid,
                  'booked-but-not-paid': item.is_booked && !item.is_paid,
                  book: item.id && !item.is_booked,
                  closed: item.title == 'закрыто' || item.title == 'занято'
                }"
                class="table-item"
                v-for="(item, index) in mobileTable.data"
                :key="'mobile-table-item' + index"
              >{{ `${item.from_time ? item.from_time + ' - ' : ''}${item.to_time ? item.to_time + ' ' : ''}${item.title}` }}</div>
            </transition-group>
          </div>
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
                'booked-color': subItem.is_booked && subItem.is_paid,
                'booked-but-not-paid': subItem.is_booked && !subItem.is_paid,
                book: subItem.id && !subItem.is_booked,
                closed: subItem.title == 'закрыто' || subItem.title == 'занято'
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

      let days = data.days;

      let common = {
        from: data.time_from_common_days,
        to: data.time_to_common_days
      };

      let holiday = {
        from: data.time_from_holiday_days,
        to: data.time_to_holiday_days
      };

      let times = [
        data.time_from_common_days,
        data.time_to_common_days,
        data.time_from_holiday_days,
        data.time_to_holiday_days
      ];

      let table = createTable(data.days, times);

      return {
        full_screen: false,
        data,
        category,
        main_image: 0,
        table,
        booked: [],
        page: 1,
        user_info: {
          name: "",
          phone: ""
        },
        ownerBook: false,
        mobileModel: null
      };
    } catch (error) {
      throw error;
    }
  },
  watch: {
    mobileModel() {
      window.scrollTo({ top: 1740, behavior: "smooth" });
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

      for (let i = 0; i < header.length; i++) {
        if (header[i].button) {
          header.splice(i, 1);
        }
      }

      header.push(this.table.header[this.table.header.length - 1]);
      header.unshift(this.table.header[0]);

      for (let i = 0; i < result.length; i++) {
        let subArray = result[i].slice(this.page, this.page + 7);

        if (header.length == 9) {
          subArray.push(result[i][result[i].length - 1]);
        }

        subArray.unshift(result[i][0]);

        result[i] = subArray;
      }

      for (let i = 0; i < result.length; i++) {
        let checked = true;
        for (let j = 0; j < result[i].length; j++) {
          if (result[i][j].id) {
            checked = false;
          }
        }

        if (checked) {
          result.splice(i, 1);
          i--;
        }
      }

      return { header, result };
    },

    mobileTable() {
      if (!this.mobileModel) return { title: null, data: [] };

      let title = this.mobileModel;
      let index = this.table.header.findIndex(
        el => el.date && el.date == title
      );

      title = this.table.header[index].title[0];

      let data = [];
      this.table.result.forEach(item => {
        data.push(item[index]);
      });

      return { title, data };
    },

    workTime() {
      let times = {
        common: {
          from: this.data.work_time_from_common_days,
          to: this.data.work_time_to_common_days
        },

        holiday: {
          from: this.data.work_time_from_holiday_days,
          to: this.data.work_time_to_holiday_days
        }
      };

      let timestamps = {
        common: {},
        holiday: {}
      };

      for (let key in times) {
        for (let key2 in times[key]) {
          let date = new Date();
          date.setHours(times[key][key2].split(":")[0]);
          date.setMinutes(times[key][key2].split(":")[1]);

          timestamps[key][key2] = date.getTime();
        }
      }

      let strings = {};

      for (let key in timestamps) {
        if (Math.abs(timestamps[key].from - timestamps[key].to) == 60000) {
          strings[key] = "круглосуточно";
        } else {
          strings[key] = `${times[key].from} - ${times[key].to}`;
        }
      }

      let result = [];

      for (let key in strings) {
        if (key == "common") {
          result.push(`Будние: ${strings[key]}`);
        } else {
          result.push(`Выходные: ${strings[key]}`);
        }
      }

      return result;
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
        if (this.page + 7 < this.table.header.length - 2) {
          this.page += 7;
        }
      }
    },

    book(item, position) {
      if (!item.id || item.is_booked) return;

      let { x, y } = position;
      let table = this.table.result;

      if (table[x][y].active) {
        table[x][y].active = false;
      } else {
        this.clearTable(table, { y });
        if (
          ((table[x + 1] && !table[x + 1][y].active) || !table[x + 1]) &&
          (!table[x - 1] || (table[x - 1] && !table[x - 1][y].active))
        ) {
          this.clearTable(table, { x });
          if (
            table[x + 1] &&
            table[x + 1][y].id &&
            !table[x + 1][y].is_booked
          ) {
            table[x + 1][y].active = true;
          } else if (
            table[x - 1] &&
            table[x - 1][y].id &&
            !table[x - 1][y].is_booked
          ) {
            table[x - 1][y].active = true;
          }
        }

        table[x][y].active = true;
      }

      this.booked = [];
      for (let i = 0; i < table.length; i++) {
        if (table[i][y].active) {
          this.booked.push(table[i][y]);
        }
      }
    },

    clearTable(table, position) {
      let { x, y } = position;

      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
          if (x && x != i) {
            table[i][j].active = false;
          }
          if (y && y != j) {
            table[i][j].active = false;
          }
        }
      }
    },

    structure() {
      let result = "";

      let translations = {
        is_coach: "тренер",
        is_parking: "парковка",
        is_shower: "душевые",
        is_lights: "освещение",
        is_bathroom: "туалет",
        is_dressroom: "раздевалки",
        is_tribunes: "трибуны",
        is_sauna: "сауна"
      };

      for (let key in this.data) {
        if (
          key.includes("is_") &&
          !key.includes("is_favorite") &&
          !key.includes("is_approved") &&
          this.data[key]
        ) {
          result += translations[key] + ", ";
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
    },

    async proceedAsOwner() {
      this.ownerBook = false;

      let book_windows = this.booked.map(item => {
        return { window: item.id, date: item.date };
      });

      let { user_info } = this;

      let payload = {
        book_windows,
        playground: this.data.id,
        user_info
      };

      try {
        let response = await this.$store.dispatch("Book", payload);
        this.$store.commit("setSuccess", {
          show: true,
          message: `Площадка ${this.data.name} на ${book_windows[0].date} ${this.booked[0].from_time}-${this.booked[this.booked.length - 1].to_time}, была успешно забронирована! \n\n\Зайдите в личный кабинет, чтобы узнать подробную информацию`
        });

        this.$router.push("/cabinet");
      } catch (error) {
        alert(error + "\n Попробуйте позже");
      }
    }
  },
  mounted() {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
};
</script>
<style scoped>
#collapse-2 {
  width: 100%;
  padding: 1em 2em;
}

.booked-table {
  margin-bottom: 1em;

  overflow: auto;
}

.booked-table > div {
  background-color: #064482;
  color: white;

  padding: 1em;

  font-size: 1.5em;

  position: sticky;
  left: 0;

  /* font-weight: bold; */
}

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

.book_button > button:hover {
  background-color: #347cc4;
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

.booking > .mobile-table {
  display: none;

  padding: 1em;
  position: sticky;
  left: 0;
}

.mobile-table > input {
  margin-bottom: 1em;
}

.table > .table-item {
  font-size: 1.25rem;

  border: solid 1px #064482;
  margin-bottom: -1px;

  padding: 0.5em;

  color: #064482;
}

.table > .title {
  color: #064482;
}

.booking > .legend {
  display: flex;
}

.legend > div {
  height: 1.5rem;
  margin-right: 3rem;
  margin-left: 0.5rem;

  display: flex;
  align-items: center;

  color: #064482;
}

.legend > div > .color {
  height: 1rem;
  width: 1rem;

  margin-right: 0.5rem;
  background-color: #064482;
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

  background-color: rgba(0, 0, 0, 0.16);

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  position: relative;

  /* border-radius: 12px; */
}

.main_image > .image-arrow {
  position: absolute;

  top: 40%;

  border-radius: 50%;

  width: 5em;
  height: 5em;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
}

.inf > .full-screen {
  position: fixed;

  height: 100%;
  width: 100%;
  max-width: 100%;

  z-index: 999999;

  top: 0;
  left: 0;

  background-size: contain !important;
}

.inf > .images {
  display: block;

  width: 58%;
  max-width: 58%;
}

.inf > .active {
  border: solid 1px #064482;
}

.inf > .information {
  width: 40%;
}

.information > div {
  display: flex;
  margin-bottom: 1em;
}

.information > div > span {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.information > div > span > label {
  margin: 0;
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
}

.img > * {
  display: none;
}

.images > .img:hover {
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2);
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

.active {
  background-color: #bbffbb;
}

.booked-color {
  background-color: #ffbbbb;
  color: #0745822f !important;
}

.booked-but-not-paid {
  background-color: rgba(255, 237, 5, 0.5);
  color: #0745822f !important;
}

.closed {
  color: rgb(150, 150, 150) !important;
}

@media (max-width: 767px) {
  #collapse-2 {
    padding: 1em 0;
  }

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

  .body > .book_button {
    left: -2px;
    padding: 0;

    width: calc(100% + 4px);
  }

  .book_button > button {
    padding: 0.75em 0;
    width: 100%;
  }

  .body > .title {
    left: 0.5em;
    font-size: 2em;
  }

  .body > .booking {
    padding: 0;
    overflow: auto;
  }

  .booking > .mobile-table {
    display: block;
  }

  .booking > .legend {
    flex-direction: column;
    position: sticky;

    left: 0;
  }

  .booking > .title {
    left: 0;

    padding: 1em;
    width: 100%;
    position: sticky;
  }

  table {
    table-layout: auto;
    display: none;
  }

  td {
    width: 10em;
    min-width: 10em;
  }

  .body > .inf {
    flex-direction: column;
  }

  .inf > div {
    width: 100% !important;
    max-width: 100% !important;
  }

  .inf > .main_image {
    margin-top: 2.5em;

    height: 15em;
    margin-bottom: 1em;

    background-size: cover;
  }

  .main_image > * {
    display: none !important;
  }

  .inf > .full-screen {
    position: fixed;

    height: 100%;
    width: 100%;
    max-width: 100%;

    z-index: 999999;

    top: 0;
    left: 0;

    margin: 0;
  }

  .full-screen > button {
    width: 100%;

    text-align: center;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .full-screen > * {
    display: flex !important;
  }

  .main_image > .image-arrow {
    border-radius: 50% !important;
    top: initial;
    bottom: 10%;
  }

  .inf > .information {
    padding: 0.5em;
  }

  .inf > .images {
    padding: 0 0.5em;
  }

  .images > .img {
    margin: 0 !important;
    margin-bottom: 1em !important;

    width: 100%;
    height: 10em;
  }

  .img > * {
    display: flex;
  }
}
</style>
