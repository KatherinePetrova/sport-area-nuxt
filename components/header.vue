<template>
  <nav class="navbar navbar-dark">
    <nuxt-link to="/">
      <img class="mr-2" src="/logo.png" alt="logo img" height="50" />
    </nuxt-link>

    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <nuxt-link class="navbar-brand font-weight-bold logo-title" to="/">
          ОНЛАЙН БРОНИРОВАНИЕ
          <br />СПОРТИВНЫХ ПЛОЩАДОК
        </nuxt-link>
      </li>
    </ul>
    <ul class="navbar-nav ml-3">
      <li class="nav-item">
        <template v-if="user.token">
          <b-button
            variant="outline-light"
            v-if="user.profile && user.profile.is_provider && !user.profile.is_creator"
            @click="linkTo = true"
            class="nav-button"
          >Добавить поле</b-button>
          <b-button
            variant="outline-light"
            v-if="user.profile && user.profile.is_creator && user.profile.is_provider"
            class="nav-button"
            @click="$router.push('/add')"
          >Добавить поле</b-button>
          <b-button
            variant="outline-light"
            @click="$router.push('/cabinet')"
            class="nav-button"
          >Личный кабинет</b-button>
        </template>
        <b-button
          v-else
          variant="outline-light"
          @click="open('login')"
          style="transition: 0.5s"
          class="nav-button"
        >
          <span>ВОЙТИ</span>
        </b-button>

        <b-modal v-model="linkTo" hide-footer hide-header>
          <div class="link-to">
            <span style="margin-top: 0">Для добавления спортивной площадки свяжитесь с менеджером:</span>
            <span>+7 (747) 834-7544</span>
            <span>info@sport-area.kz</span>
          </div>
        </b-modal>

        <b-modal v-model="modals.forgot.show" hide-footer hide-header>
          <b-form @submit.prevent="sendForgot()">
            <label style="text-align: center">Восстановление пароля</label>
            <b-form-input type="email" placeholder="Введите E-mail"></b-form-input>
            <b-button type="submit" style="margin-top: 2em">Далее</b-button>
          </b-form>
        </b-modal>

        <b-modal v-model="modalsShow.login" hide-footer hide-header>
          <b-form @submit.prevent="auth()">
            <label>Авторизация</label>
            <b-form-input placeholder="Логин" v-model="modals.login.username"></b-form-input>
            <b-form-input placeholder="Пароль" v-model="modals.login.password" type="password"></b-form-input>
            <b-form-invalid-feedback :state="modals.login.validation">Неверный логин или пароль</b-form-invalid-feedback>
            <b-link style="margin-bottom: 2em" @click="openForgot">Забыли пароль</b-link>
            <b-button
              type="submit"
              class="form_button"
              variant="primary"
              style="transition: 0.5s"
              :disabled="form_loading"
            >
              <b-spinner small style="margin-right: 0.5em" v-if="form_loading"></b-spinner>Войти
            </b-button>

            <b-button class="form_button" @click="open('register')" variant="info">Регистрация</b-button>
          </b-form>
        </b-modal>

        <b-modal v-model="modalsShow.register" hide-footer hide-header>
          <b-form @submit.prevent="reg()">
            <label style="margin-bottom: 1em">Регистрация</label>
            <b-form-input
              id="input-reg-username"
              placeholder="Логин"
              v-model="modals.register.username"
              required
              :state="errors.register.username.state"
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-reg-username-feedback"
            >{{ errors.register.username.message }}</b-form-invalid-feedback>
            <b-form-input
              id="input-reg-email"
              placeholder="E-mail"
              type="email"
              v-model="modals.register.email"
              required
              :state="errors.register.email.state"
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-reg-username-feedback"
            >{{ errors.register.email.message }}</b-form-invalid-feedback>
            <b-form-input
              placeholder="Номер телефона"
              type="tel"
              v-model="modals.register.profile.phone"
              required
            ></b-form-input>
            <b-form-input
              id="input-reg-password"
              placeholder="Пароль"
              type="password"
              v-model="modals.register.password"
              required
              :state="errors.register.password.state"
            ></b-form-input>
            <b-form-input
              id="input-reg-password2"
              placeholder="Повторите пароль"
              type="password"
              v-model="modals.register.password2"
              required
              :state="errors.register.password2.state"
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-reg-password2-feedback"
            >{{ errors.register.password2.message }}</b-form-invalid-feedback>
            <b-form-select
              v-model="modals.register.profile.is_provider.model"
              :options="modals.register.profile.is_provider.options"
              placeholder="Выберите роль"
              required
            ></b-form-select>
            <b-form-input
              id="input-reg-organization"
              placeholder="Название организации"
              v-if="modals.register.profile.is_provider.model"
              v-model="modals.register.profile.organization"
              :state="errors.register.organization.state"
              required
            ></b-form-input>
            <b-form-invalid-feedback
              id="input-reg-username-feedback"
            >{{ errors.register.organization.message }}</b-form-invalid-feedback>
            <b-button type="submit" variant="primary" style="margin-top: 1.5em">Зарегистрироваться</b-button>
          </b-form>
        </b-modal>
        <b-modal v-model="enterVerify" hide-footer hide-header small>
          <b-form @submit.prevent="verify">
            <label style="font-size: 4em;" v-if="verifyTime">{{ verifyTime }}</label>
            <b-button style="font-size: 1.5em;" v-else @click="setCount(true)">Отправить код</b-button>
            <label style="font-size: 1em; text-align: center; font-weight: 600; margin-bottom: 3em">
              На ваш номер телефона
              было выслано сообщение с кодом
              введите его в поле
            </label>
            <b-form-input
              id="input-verify"
              placeholder="Введите код"
              v-model="verifyCode"
              :state="errors.verify.state"
            ></b-form-input>
            <b-form-invalid-feedback id="input-verify-feedback">{{ errors.verify.message }}</b-form-invalid-feedback>
            <b-button
              type="submit"
              variant="primary"
              style="margin-top: 1.5em"
              @click="verify()"
            >Далее</b-button>
          </b-form>
        </b-modal>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  methods: {
    openForgot() {
      this.$store.commit("setModals", { login: false, register: false });
      this.modals.forgot.show = true;
    },

    setCount(send) {
      this.count = 90000;
      this.enterVerify = true;
      clearInterval(this.interval);

      this.interval = setInterval(() => {
        this.count = this.count - 1000;
        if (this.count <= 0) clearInterval(this.interval);
      }, 1000);

      if (send) this.$store.dispatch("sendVerify");
    },
    async verify() {
      try {
        await this.$store.dispatch("verify", { token: this.verifyCode });
        clearInterval(this.interval);
        this.enterVerify = false;

        this.open();
        this.$store.commit("setSuccess", {
          show: true,
          message: "Регистрация успешно завершена"
        });
      } catch (error) {
        console.log([error]);
      }
    },

    open(open) {
      let result = { login: false, register: false };
      if (open) result[open] = true;
      this.$store.commit("setModals", result);
    },

    async auth() {
      try {
        this.form_loading = true;

        let payload = JSON.parse(JSON.stringify(this.modals.login));

        delete payload.validation;
        await this.$store.dispatch("auth", payload);

        this.$store.commit("setModals", { login: false, register: false });

        document.cookie = `token=${this.user.token}`;
        document.cookie = `user_id=${this.user.id}`;

        this.form_loading = false;
      } catch (error) {
        this.modals.login.validation = false;
        this.form_loading = false;
      }
    },

    async reg() {
      try {
        let payload = JSON.parse(JSON.stringify(this.modals.register));
        if (payload.password != payload.password2) {
          throw {
            response: {
              data: {
                password: ["пароли должны совпадать"],
                password2: ["пароли должны совпадать"]
              }
            }
          };
        }

        delete payload.password2;
        payload.profile.is_provider = payload.profile.is_provider.model;

        if (!payload.profile.is_provider) delete payload.profile.organization;

        await this.$store.dispatch("register", payload);
        this.$store.commit("setModals", { login: false, register: false });

        await this.$store.dispatch("sendVerify");
        this.setCount();
      } catch (error) {
        let { data } = error.response;
        for (let key in data) {
          this.errors.register[key].message = data[key][0];
          this.errors.register[key].state = false;
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    modalsShow() {
      return this.$store.state.modals;
    },
    verifyTime() {
      let date = {
        minutes: new Date(this.count).getMinutes(),
        seconds: new Date(this.count).getSeconds(),

        str: null
      };

      if (date.minutes >= 0) {
        date.str = `0${date.minutes}:`;
      }

      if (date.seconds >= 0) {
        date.str += `${date.seconds > 9 ? date.seconds : "0" + date.seconds}`;
      }

      if (date.minutes <= 0 && date.seconds <= 0) {
        date.str = null;
      }

      return date.str;
    }
  },
  data() {
    return {
      linkTo: false,
      interval: null,
      count: 90000,
      enterVerify: false,
      verifyCode: "",
      form_loading: false,
      errors: {
        verify: {
          state: null,
          message: ""
        },
        register: {
          username: {
            state: true,
            message: ""
          },
          password: {
            state: true,
            message: ""
          },
          password2: {
            state: true,
            message: "Пароли должны совпадать"
          },
          email: {
            state: true,
            message: ""
          },
          organization: {
            state: true,
            message: ""
          }
        }
      },
      modals: {
        forgot: {
          show: false,
          model: ""
        },
        login: {
          username: null,
          password: null,
          validation: true
        },
        register: {
          username: "",
          password: "",
          password2: "",
          email: "",
          profile: {
            phone: "",
            is_provider: {
              options: [
                { value: null, text: "Выберите роль", disabled: true },
                { value: true, text: "Организация" },
                { value: false, text: "Игрок" }
              ],
              model: null
            },
            organization: ""
          }
        }
      }
    };
  }
};
</script>

<style scoped>
.link-to {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  color: #064482;

  text-align: center;
}

.link-to > * {
  text-align: center;
  margin-top: 1em;
  font-size: 1.5em;
}
.modal-content {
  border: solid 1px #064482 !important;
}

@media (max-width: 767px) {
  .logo-title {
    display: none;
  }
  .nav-button {
    font-size: 0.8em;
    height: 100%;
  }
}
</style>

