<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <img class="mr-2" src="/logo.png" alt="logo img" height="50" />

    <div class="collapse navbar-collapse" id="navbar1">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="navbar-brand font-weight-bold" href="/">
            ОНЛАЙН БРОНИРОВАНИЕ
            <br />СПОРТИВНЫХ ПЛОЩАДОК
          </a>
        </li>
      </ul>
      <ul class="navbar-nav ml-3">
        <li class="nav-item">
          <template v-if="user.id">
            <b-button variant="outline-light" @click="$router.push('/cabinet')">Личный кабинет</b-button>
          </template>
          <b-button
            variant="outline-light"
            @click="open('login')"
            v-else
            style="transition: 0.5s"
            :disabled="loading"
          >
            <b-spinner small style="margin-right: 0.5em" v-if="loading"></b-spinner>
            <span>ВОЙТИ</span>
          </b-button>

          <b-modal v-model="modals.login.show" hide-footer hide-header>
            <b-form @submit.prevent="auth()">
              <label>Авторизация</label>
              <b-form-input placeholder="Логин" v-model="modals.login.username"></b-form-input>
              <b-form-input placeholder="Пароль" v-model="modals.login.password" type="password"></b-form-input>
              <b-form-invalid-feedback :state="modals.login.validation">Неверный логин или пароль</b-form-invalid-feedback>
              <b-link style="margin-bottom: 2em">Забыли пароль</b-link>
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

          <b-modal v-model="modals.register.show" hide-footer hide-header>
            <b-form @submit.prevent="reg()">
              <label style="margin-bottom: 1em">Регистрация</label>
              <b-form-input placeholder="Логин" v-model="modals.register.username" required></b-form-input>
              <b-form-input
                placeholder="E-mail"
                type="email"
                v-model="modals.register.email"
                required
              ></b-form-input>
              <b-form-input
                placeholder="Номер телефона"
                type="tel"
                v-model="modals.register.profile.phone"
                required
              ></b-form-input>
              <b-form-input
                placeholder="Пароль"
                type="password"
                v-model="modals.register.password"
                required
              ></b-form-input>
              <b-form-input
                placeholder="Повторите пароль"
                type="password"
                v-model="modals.register.password2"
                required
              ></b-form-input>
              <b-form-select
                v-model="modals.register.profile.is_provider.model"
                :options="modals.register.profile.is_provider.options"
                placeholder="Выберите роль"
                required
              ></b-form-select>
              <b-form-input
                placeholder="Название организации"
                v-if="modals.register.profile.is_provider.model"
              ></b-form-input>
              <b-button type="submit" variant="primary" style="margin-top: 1.5em">Зарегистрироваться</b-button>
            </b-form>
          </b-modal>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  async beforeMount() {
    let cookie = document.cookie.split("; ");
    let objCookie = {};

    cookie.forEach(item => {
      objCookie[item.split("=")[0]] = item.split("=")[1];
    });

    if (objCookie.user_id && objCookie.user_id != "undefined") {
      await this.$store.dispatch("getUser", objCookie.user_id);

      let user = { ...this.$store.state.user };
      user.token = objCookie.token;

      this.$store.commit("setUser", user);

      this.loading = false;
    } else {
      this.loading = false;
    }
  },
  methods: {
    open(open) {
      for (let key in this.modals) {
        this.modals[key].show = false;
      }

      this.modals[open].show = true;
    },

    async auth() {
      try {
        this.form_loading = true;

        let payload = JSON.parse(JSON.stringify(this.modals.login));

        delete payload.show;
        delete payload.validation;
        await this.$store.dispatch("auth", payload);

        this.modals.login.show = false;

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

        delete payload.show;
        delete payload.password2;
        payload.profile.is_provider = payload.profile.is_provider.model;

        if (!payload.profile.is_provider) delete payload.profile.organization;

        await this.$store.dispatch("register", payload);
      } catch (error) {
        throw error;
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      loading: true,
      form_loading: false,
      modals: {
        login: {
          show: false,
          username: null,
          password: null,
          validation: true
        },
        register: {
          show: false,
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
.modal-content {
  border: solid 1px #064482 !important;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 2em 8em;

  color: #064482;
}

form > label {
  font-weight: bold;
  font-size: 1.5em;
}

form > button {
  width: 100%;
  background-color: #064482;

  border: none;
}

form > * {
  margin-bottom: 0.5em;
}

form > input {
  border-radius: 3.5px !important;
}

form > select {
  border-radius: 3.5px !important;
}
</style>

