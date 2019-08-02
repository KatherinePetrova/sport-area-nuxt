<template>
  <div class="cabinet_main" @click.stop="close">
    <b-link @click="exit()">ВЫЙТИ</b-link>
    <div class="main">
      <div class="title">Личный кабинет</div>
      <div class="save_button">
        <button @click="save()" :disabled="loading">
          Сохранить
          <b-spinner small style="margin-right: 0.5em" v-if="loading"></b-spinner>
        </button>
      </div>
      <div class="cabinet_block">
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Фото пользователя</b-form-text>
          <div class="image-uploader">
            Нажмите сюда, чтобы добавить фото
            <input type="file" @change="previewFile" />
            <img :src="imageData" v-if="imageData && imageData.length > 0" />
          </div>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Имя Фамилия</b-form-text>
          <b-form-input class="cabinet_input" v-model="user.names"></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text
            style="font-size: 0.4em; color: #064482 !important"
          >Электронная почта (E-mail)</b-form-text>
          <b-form-input class="cabinet_input" type="email" v-model="user.email" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Номер телефона</b-form-text>
          <b-form-input class="cabinet_input" type="tel" v-model="user.profile.phone" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Пароль</b-form-text>
          <b-form-input
            class="cabinet_input"
            type="password"
            placeholder="Изменить"
            @click="changePassword.show = true"
            ref="changePassword"
          ></b-form-input>
          <b-modal v-model="changePassword.show" hide-footer hide-header>
            <b-form @submit.prevent="sendPassword">
              <label style="margin-bottom: 1em">Смена пароля</label>
              <b-form-input
                id="changePassword-old"
                type="password"
                style="margin-bottom: 1.5em"
                placeholder="Введите старый пароль"
                v-model="changePassword.password"
                :state="changePassword.validation.password.state"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                id="changePassword-old-feedback"
              >{{ changePassword.validation.password.message }}</b-form-invalid-feedback>
              <b-form-input
                id="changePassword-new"
                type="password"
                placeholder="Введите новый пароль"
                v-model="changePassword.new_password"
                :state="changePassword.validation.new_password.state"
                required
              ></b-form-input>
              <b-form-input
                id="changePassword-new2"
                type="password"
                placeholder="Повторите новый пароль"
                v-model="changePassword.new_password2"
                :state="changePassword.validation.new_password2.state"
                required
              ></b-form-input>
              <b-form-invalid-feedback
                id="changePassword-new2-feedback"
              >{{ changePassword.validation.new_password.message }}</b-form-invalid-feedback>
              <b-button type="submit" style="margin-top: 2em">Сохранить изменения</b-button>
            </b-form>
          </b-modal>
        </div>
      </div>
      <div class="cabinet_block">
        <label style="font-size: 0.75em">Данные банковской карты</label>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Номер карты</b-form-text>
          <b-form-input class="cabinet_input" type="password" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Имя владельца карты</b-form-text>
          <b-form-input class="cabinet_input" type="password" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Срок действия</b-form-text>
          <b-form-input class="cabinet_input" type="password" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">CCV</b-form-text>
          <b-form-input class="cabinet_input" type="password" disabled></b-form-input>
        </div>
      </div>
    </div>
    <div class="add-inf" :style="{ justifyContent: showLess ? 'flex-end' : 'space-between' }">
      <transition name="slide">
        <div class="my-booked" v-if="!showLess">
          <div class="title">Мои брони</div>
          <div class="result">
            <div
              class="block"
              v-for="(item, index) in myBooks"
              :key="'myBooks' + index"
              :ref="'myBook' + index"
              :class="{ clicked: item.clicked }"
              @click.stop="more(index, 'showMore')"
            >
              <div
                class="img"
                :style="{backgroundImage: `url(${item.playground.images.length > 0 ? item.playground.images[0].image : '/img/soccer.png'})`}"
              ></div>
              <div class="content">
                <div style="font-size: 1.5em">{{ item.playground.name }}</div>
                <div>{{ `Полная стоимость - ${Math.round(item.total_cost)} тг` }}</div>
                <div class="small">{{`Адрес - ${item.playground.location.address}`}}</div>
                <div class="small">{{`Тип покрытия - ${item.playground.type}`}}</div>
                <div
                  class="small"
                  style="margin-bottom: 1.5em;"
                >{{`Размеры - ${Math.round(item.playground.width)}x${Math.round(item.playground.length)}`}}</div>
                <nuxt-link :to="`/playground/${item.playground.id}`" @click.stop>Подробнее</nuxt-link>
              </div>
            </div>
            <div v-if="myBooks.length == 0">Ничего нет...</div>
          </div>
          <transition name="slide">
            <div class="more" v-if="showMore" @click.stop>
              <label>Имя Фамилия</label>
              <b-form-input disabled :value="moreData.user_info.name"></b-form-input>
              <label>Контактные данные</label>
              <b-form-input style="margin-bottom: 2em;" disabled :value="moreData.user_info.phone"></b-form-input>
              <label>Дата и время брони</label>
              <b-form-input
                style="margin-bottom: 2em;"
                disabled
                :value="moreData.date + '\t' + moreData.time_range"
              ></b-form-input>
              <label>Итоговая стоимость</label>
              <b-form-input
                style="margin-bottom: 2em;"
                disabled
                :value="Math.round(moreData.total_cost) + ' тг'"
              ></b-form-input>
              <label>Статус оплаты</label>
              <b-form-input
                style="margin-bottom: 2em;"
                disabled
                :value="moreData.is_paid ? 'Оплачено' : 'Ожидается оплата'"
              ></b-form-input>
              <label>Комментарии</label>
              <b-form-textarea id="textarea" rows="3" max-rows="6" disabled></b-form-textarea>
            </div>
          </transition>
        </div>
      </transition>

      <transition name="slide">
        <div
          class="my-booked"
          v-if="(user.profile.is_provider || user.profile.is_creator) && !showMore"
          style="flex-direction: row-reverse"
        >
          <div class="title">Мои объекты</div>
          <div class="result">
            <div
              class="block"
              v-for="(item, index) in myObjects"
              :key="'myBooks' + index"
              :ref="'myBook' + index"
              :class="{ clicked: item.clicked }"
              @click.stop="more(index, 'showLess')"
            >
              <transition name="shade">
                <div class="loading" v-if="item.loading">
                  <img src="/img/loading.gif" />
                </div>
              </transition>
              <div
                class="img"
                :style="{backgroundImage: `url(${item.images.length > 0 ? item.images[0].image : '/img/soccer.png'})`}"
              ></div>
              <div class="content">
                <div style="font-size: 1.5em">{{ item.name }}</div>
                <div>{{ `Стоимость - от ${Math.round(item.cost*2)} тг` }}</div>
                <div class="small">{{`Адрес - ${item.location.address}`}}</div>
                <div class="small">{{`Тип покрытия - ${item.type}`}}</div>
                <div
                  class="small"
                  style="margin-bottom: 1.5em;"
                >{{`Размеры - ${Math.round(item.width)}x${Math.round(item.length)}`}}</div>
                <nuxt-link :to="`/playground/${item.id}`" @click.stop>Подробнее</nuxt-link>
              </div>
            </div>
            <div v-if="myObjects.length == 0">Ничего нет...</div>
          </div>
          <transition name="slide">
            <div class="more change" v-if="showLess">
              <div class="save">
                <b-button @click.stop="saveChanges" :disabled="lessData.loading">Сохранить</b-button>
              </div>
              <div class="days">
                <div
                  :class="{active: lessData.selected == index}"
                  v-for="(item, index) in lessData.weekDays"
                  :key="index + 'day' +index"
                  @click.stop="lessData.selected = index"
                >{{ item }}</div>
              </div>
              <div class="open">
                <div
                  @click.stop="lessData.data[lessData.selected].is_closed = !lessData.data[lessData.selected].is_closed"
                >
                  <div
                    class="toggle"
                    :class="{'toggle-2': !lessData.data[lessData.selected].is_closed}"
                  ></div>
                </div>
                <label>{{ !lessData.data[lessData.selected].is_closed ? 'открыто' : 'закрыто' }}</label>
              </div>
              <label style="color: #064482">Время и цена</label>
              <div class="times" @click.stop>
                <div
                  class="time"
                  v-for="(item, index) in lessData.data[lessData.selected].windows"
                  :key="'times' + index"
                >
                  <b-form-input
                    :value="`${item.from_time} - ${item.to_time}`"
                    disabled
                    style="margin-right: 1em"
                  ></b-form-input>
                  <b-form-input
                    type="number"
                    v-model="lessData.data[lessData.selected].windows[index].price"
                  ></b-form-input>
                </div>
                <div class="cover" v-if="lessData.data[lessData.selected].is_closed"></div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import api from "~/service/api.js";
let weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export default {
  async asyncData({ store, redirect, query }) {
    if (!store.state.user.id) {
      redirect("/");
    } else {
      let user = JSON.parse(JSON.stringify(store.state.user));
      user.names = user.first_name + " " + user.last_name;
      try {
        let myObjects = [];

        let successMessage = null;

        if (query.payment_success) {
          let success = JSON.parse(query.payment_success);

          successMessage = `Предоплата брони ${success.name}, ${success.date} ${success.time} на сумму ${success.sum} тг прошла успешно.\n\nЗайдите в личный кабинет, чтобы узнать подоброную информацию`;
        }

        await store.dispatch("getMyBooks");
        if (user.profile.is_provider) {
          myObjects = await store.dispatch("getMyObjects");
        }

        myObjects.forEach(item => {
          item.clicked = false;
        });

        return {
          successMessage,
          user,
          myObjects,
          loading: false,
          imageData:
            user.profile &&
            user.profile.photo &&
            user.profile.photo.includes("http")
              ? user.profile.photo
              : "http://80.241.42.214:8000" + user.profile.photo,
          showMore: false,
          showLess: false,
          moreData: {},
          lessData: {
            weekDays,
            selected: 0,
            data: [],
            id: 0,
            loading: false
          },
          changePassword: {
            show: false,
            password: "",
            new_password: "",
            new_password2: "",
            validation: {
              password: {
                state: null,
                message: ""
              },
              new_password: {
                state: null,
                message: ""
              },
              new_password2: {
                state: null,
                message: ""
              }
            }
          }
        };
      } catch (error) {
        redirect("/");
      }
    }
  },

  watch: {
    "changePassword.show"(newValue) {
      let element = this.$refs.changePassword;
      element.blur();
    }
  },
  mounted() {
    if (this.successMessage) {
      this.$store.commit("setSuccess", {
        show: true,
        message: this.successMessage
      });
    }
  },
  computed: {
    myBooks() {
      return this.$store.state.myBooks;
    }
  },
  methods: {
    async saveChanges() {
      try {
        let schedule = [];
        let closed_days = [];

        this.lessData.loading = true;

        this.lessData.data.forEach((item, index) => {
          if (item.is_closed) {
            closed_days.push(item.day);
          }

          item.windows.forEach((item2, index2) => {
            schedule.push({
              day: item.day,
              from_time: item2.from_time,
              to_time: item2.to_time,
              price: item2.price
            });
          });
        });

        let response = await this.$store.dispatch("putPlayground", {
          data: { schedule, closed_days },
          id: this.lessData.id
        });

        this.$store.commit("setSuccess", {
          show: true,
          message: "Успех!"
        });

        this.lessData.loading = false;
      } catch (error) {
        alert(error.message);
      }
    },
    async sendPassword() {
      try {
        let payload = JSON.parse(JSON.stringify(this.changePassword));
        delete payload.show;
        delete payload.validation;

        if (payload.new_password != payload.new_password2) {
          throw {
            response: {
              data: {
                new_password: ["Пароли должны совпадать"],
                new_password2: ["Пароли должны совпадать"]
              }
            }
          };
        }

        delete payload.new_password2;

        let response = await this.$store.dispatch("changePassword", payload);

        this.changePassword.show = false;
        this.$store.commit("setSuccess", {
          show: true,
          message: "Пароль успешно изменен!"
        });
      } catch (error) {
        console.log(error.response);

        let { data } = error.response;
        for (let key in data) {
          this.changePassword.validation[key].state = false;
          this.changePassword.validation[key].message = data[key][0];
        }
      }
    },
    async more(index, show) {
      this[show] = false;

      if (show == "showMore") {
        this.myBooks.forEach(item => {
          item.clicked = false;
        });

        this.moreData = this.myBooks[index];
        this.myBooks[index].clicked = true;
      } else {
        this.myObjects.forEach(item => {
          item.clicked = false;
        });

        this.myObjects[index].clicked = true;
        this.myObjects[index].loading = true;

        let playground = await this.$store.dispatch(
          "getPlayground",
          this.myObjects[index].id
        );

        this.lessData.id = this.myObjects[index].id;

        let data = [];
        this.lessData.weekDays.forEach((item, index) => {
          let day = playground.days.find(el => el.day == index + 1);
          data.push(day);
        });

        this.lessData.data = data;
        this.myObjects[index].loading = false;
      }

      this[show] = true;
    },
    close() {
      this.showMore = false;
      this.showLess = false;

      this.myBooks.forEach(item => {
        item.clicked = false;
      });

      this.myObjects.forEach(item => {
        item.clicked = false;
        item.loading = false;
      });
    },
    previewFile(event) {
      try {
        let reader = new FileReader();
        let input = event.target;

        reader.onload = e => {
          this.imageData = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
        this.user.profile.photo = input.files[0];
      } catch (error) {}
    },
    exit() {
      this.$router.push("/");

      document.cookie = `user_id= ; expires = ${new Date(0)}`;
      document.cookie = `token= ; expires = ${new Date(0)}`;

      this.$store.commit("setUser", {});
    },

    async save() {
      this.loading = true;

      let form = new FormData();

      let payload = {
        id: this.user.id,
        first_name: this.user.names.split(" ")[0],
        last_name: this.user.names.split(" ")[1],
        photo: this.user.profile.photo
      };

      let names = {
        first_name: "Имени",
        last_name: "Фамилии",
        photo: "Аватара"
      };

      if (typeof payload.photo == "string") delete payload.photo;

      for (let key in payload) {
        if (!payload[key]) {
          delete payload[key];
        } else {
          if (key != "id") form.append(key, payload[key]);
        }
      }

      try {
        await this.$store.dispatch("updateUser", { form, id: payload.id });

        this.$store.commit("setSuccess", {
          show: true,
          message: "Изменения прошли успешно"
        });
        this.loading = false;
      } catch (error) {
        console.log(error.response);

        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.change > * {
  margin-bottom: 1em;
}

.change {
  font-size: 12px !important;
}

.change > .save {
  position: absolute;

  bottom: -2.25em;
  left: 9em;

  padding: 0 3em;

  background-color: white;
}

.save > button {
  background-color: #064482;
  color: white;

  border: none;

  padding: 0.5em 3em;
}

.save > button:hover {
  background-color: #5a96d3;
}

.times {
  display: flex;
  flex-direction: column;

  position: relative;
}

.times > .time {
  display: flex;
  margin-bottom: 1em;
}

.times > .cover {
  background-color: rgba(255, 255, 255, 0.7);

  position: absolute;

  height: 100%;
  width: 100%;

  z-index: 1;
}

.days {
  display: flex;
}

.days > div {
  border: solid 1px #064482;
  margin-left: -1px;

  font-size: 1.75em;
  width: 100%;

  text-align: center;

  color: #06448262;

  backdrop-filter: blur(30px);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

  cursor: pointer;
}

.days > div:hover {
  background-color: #c8d5e3;
  color: #064482;
}

.days > .active {
  background-color: #c8d5e3;
  color: #064482;
}

.open {
  display: flex;
  color: #064482;

  align-items: center;
}

.open > div {
  width: 3em;
  height: 1.5em;

  border-radius: 1em;

  background-color: #064482;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  cursor: pointer;

  transition: 0.5s;
}

div > .toggle {
  background-color: white;
  border-radius: 1em;

  height: 1.35em;
  width: 1.35em;

  position: absolute;

  right: 1px;

  transition: 0.1s;
}

div > .toggle-2 {
  right: calc(3em - 1.35em - 1px);
}

.open > label {
  margin: 0;
  margin-left: 0.5em;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
  position: absolute;
}
.slide-enter {
  transform: translateX(10%);
  opacity: 0;
  position: absolute;
}

.slide-leave-active {
  transform: translateX(-10%);
  opacity: 0;
  position: absolute;
}

.image-uploader {
  height: 12rem;
  width: 50%;

  border: solid 1px #064482;
  color: #064482;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 0.5em;
  text-align: center;

  overflow: hidden;
}

.image-uploader > input {
  height: 100%;
  width: 100%;

  z-index: 1;

  opacity: 0;
  position: absolute;
}

.image-uploader > img {
  background-color: white;
  width: 100%;

  position: absolute;
}

.cabinet_main {
  width: 100%;

  font-size: 14px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 1em 15em;

  position: relative;
  color: #064482;
}

.cabinet_main > .add-inf {
  margin-top: 2em;

  width: 100%;

  display: flex;
  justify-content: space-between;

  position: relative;
}

.add-inf > .my-booked {
  width: 48%;

  padding: 2em 0;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;

  transition: 0.5s;

  display: flex;
  justify-content: space-between;

  height: 1%;
}

.my-booked > .more {
  width: 48%;
  min-width: 100%;

  padding: 3em;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  transition: 0.5s;
  margin-left: 1.5em;
  margin-right: 1.5em;

  position: relative;

  height: 1%;
  min-height: fit-content;
}

.more > label {
  font-size: 14px;
  margin-bottom: 0;
}

.more > input {
  border: solid 1px #064482 !important;
  margin-bottom: 1em;
}

.more > textarea {
  border-radius: 0;
  border: solid 1px #064482 !important;
  margin-bottom: 1em;
}

.my-booked > .result {
  min-width: 100%;
  width: 100%;

  display: flex;
  align-items: center;

  flex-direction: column;

  height: 1%;
}

.result > .block {
  width: 90%;

  padding: 1em;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

  display: flex;

  background-color: white;

  margin-bottom: 1em;
  transition: 0.5s;

  position: relative;
}

.result > .block:hover {
  width: 101%;
}

.result > .clicked {
  width: 101%;
}

.block > .img {
  height: auto;
  width: 10em;
  min-width: 10em;

  background-image: url("/img/soccer.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.block > .content {
  margin-left: 1em;
  margin-bottom: 1em;
  position: relative;

  width: 60%;
}

.block > .loading {
  position: absolute;

  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2em;

  background-color: rgba(255, 255, 255, 0.7);

  z-index: 1;
}

.loading > img {
  height: 100%;
}

.content > div {
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;

  width: 100%;
  cursor: default;
}

.content > .small {
  font-size: 0.8em;
}

.content > a {
  position: absolute;

  bottom: -1em;
  right: 1em;
}

.my-booked > .title {
  position: absolute;
  background-color: white;

  font-size: 2em;
  padding: 0 1em;

  top: -1em;
  left: 1.5em;
}

.cabinet_main > .main {
  font-size: 2em;

  margin: 1em 0;
  padding: 2em;

  min-height: 1em;
  width: 100%;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;

  display: flex;
  justify-content: space-between;
}

.main > .title {
  position: absolute;

  top: -0.65em;
  left: 3em;

  padding: 0 0.25em;

  /* font-family: "Century Gothic"; */
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #064482;

  background-color: white;
}

.main > .save_button {
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

  font-size: 0.75em;
}

.save_button > button {
  background-color: #064482;
  color: white;

  border: none;

  padding: 0.75em 3.5em;

  border-radius: 5px;
}

.main > .cabinet_block {
  width: 45%;
  max-width: 45%;
}

.cabinet_block > .cabinet_group {
  width: 100%;
  margin-bottom: 1em;
}

.cabinet_group > input.cabinet_input {
  border-color: #064482 !important;
  color: #064482 !important;
}

.cabinet_main > a {
  color: #064482;

  position: absolute;
  right: 1em;
  top: 1em;
}

@media (max-width: 767px) {
  .image-uploader {
    width: 100%;
  }

  .cabinet_main {
    padding: 1em 0;
  }

  .cabinet_main > .main {
    padding: 1em 0.25em;

    flex-direction: column;
  }

  .cabinet_main > .add-inf {
    flex-direction: column;
  }

  .main > .cabinet_block {
    width: 100%;
    max-width: 100%;
  }

  .main > .title {
    left: 1em;
  }

  .add-inf > .my-booked {
    width: 100%;
  }

  .block > .content {
    width: auto;
  }

  .content > div {
    width: auto;
    white-space: normal;
  }

  .my-booked > .more {
    width: 100%;
    max-width: 100%;

    height: 100%;

    max-height: 100%;
    overflow: auto;

    top: 0;
    left: 0;

    padding-bottom: 2em;

    margin: 0 !important;
    position: fixed;

    z-index: 9999;

    background-color: white;
  }

  .more > .save {
    position: fixed;

    bottom: 0;
    left: 0;

    padding: 0;
    margin: 0;

    width: 100%;

    z-index: 3;
  }

  .save > button {
    width: 100%;
  }
}
</style>
