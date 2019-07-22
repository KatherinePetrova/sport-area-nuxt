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
    <div class="add-inf">
      <transition name="slide">
        <div class="my-booked" :style="{width: showMore ? '100%' : '48%'}" v-if="!showMore2">
          <div class="title">Мои брони</div>
          <div class="result" :style="{width: showMore ? '48%' : '100%'}">
            <div
              class="block"
              v-for="(item, index) in myBooks"
              :key="'myBooks' + index"
              :ref="'myBook' + index"
              :class="{ clicked: item.clicked }"
              @click.stop="more(index, $event)"
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
                <nuxt-link :to="`/playground/${item.playground.id}`">Подробнее</nuxt-link>
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
          :style="{width: showMore2 ? '100%' : '48%'}"
          v-if="(user.profile.is_provider || user.profile.is_creator) && !showMore"
        >
          <div class="title">Мои объекты</div>
          <transition name="slide">
            <div class="more" v-if="showMore2" @click.stop>
              <label>Имя Фамилия</label>
              <b-form-input disabled></b-form-input>
              <label>Контактные данные</label>
              <b-form-input style="margin-bottom: 2em;" disabled></b-form-input>
              <label>Дата и время брони</label>
              <b-form-input style="margin-bottom: 2em;" disabled></b-form-input>
              <label>Итоговая стоимость</label>
              <b-form-input style="margin-bottom: 2em;" disabled></b-form-input>
              <label>Статус оплаты</label>
              <b-form-input style="margin-bottom: 2em;" disabled></b-form-input>
              <label>Комментарии</label>
              <b-form-textarea id="textarea" rows="3" max-rows="6" disabled></b-form-textarea>
            </div>
          </transition>
          <div class="result" :style="{width: showMore2 ? '48%' : '100%'}">
            <div
              class="block"
              v-for="(item, index) in myBooks"
              :key="'myBooks' + index"
              :ref="'myBook' + index"
              :class="{ clicked: item.clicked }"
              @click.stop="showMore2 = true"
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
                <nuxt-link :to="`/playground/${item.playground.id}`">Подробнее</nuxt-link>
              </div>
            </div>
            <div v-if="myBooks.length == 0">Ничего нет...</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect }) {
    if (!store.state.user.id) redirect("/");
    let user = JSON.parse(JSON.stringify(store.state.user));
    user.names = user.first_name + " " + user.last_name;

    await store.dispatch("getMyBooks");

    return {
      user,
      loading: false,
      imageData: user.profile.photo.includes("http")
        ? user.profile.photo
        : "http://80.241.42.214:8000" + user.profile.photo,
      showMore: false,
      showMore2: false,
      moreData: {},
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
  },
  computed: {
    myBooks() {
      return this.$store.state.myBooks;
    }
  },
  methods: {
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

        // let response = await this.$store.dispatch("changePassword", payload);

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
    more(index) {
      this.showMore = false;

      this.myBooks.forEach(item => {
        item.clicked = false;
      });

      this.moreData = this.myBooks[index];
      this.myBooks[index].clicked = true;

      setTimeout(() => {
        this.showMore = true;
      }, 100);
    },
    close() {
      this.showMore = false;
      this.showMore2 = false;

      this.myBooks.forEach(item => {
        item.clicked = false;
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

<style>
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
  height: 100%;

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
}

.my-booked > .more {
  width: 48%;
  min-width: 40em;

  padding: 5em;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;

  transition: 0.5s;
  margin-right: 1.5em;
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
  width: 100%;

  display: flex;
  align-items: center;

  flex-direction: column;
}

.result > .block {
  width: 90%;

  padding: 1em;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

  display: flex;

  background-color: white;

  margin-bottom: 1em;
  transition: 0.5s;
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

  max-width: calc(100% - 10em);
}

.content > div {
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
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
  .cabinet_main {
    padding: 1em 1em;
  }

  .my-booked > .more {
    min-width: 30em;
  }
}
</style>
