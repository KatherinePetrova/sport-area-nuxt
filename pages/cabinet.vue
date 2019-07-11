<template>
  <div class="cabinet_main">
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
          <input
            type="file"
            class="image-uploader"
            @change="previewFile"
            :style="{backgroundImage: `url('${user.profile.photo}')`}"
          />
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Имя Фамилия</b-form-text>
          <b-form-input class="cabinet_input" v-model="user.names"></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text
            style="font-size: 0.4em; color: #064482 !important"
          >Электронная почта (E-mail)</b-form-text>
          <b-form-input class="cabinet_input" type="email" v-model="user.email"></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Номер телефона</b-form-text>
          <b-form-input class="cabinet_input" type="tel" v-model="user.profile.phone" disabled></b-form-input>
        </div>
        <div class="cabinet_group">
          <b-form-text style="font-size: 0.4em; color: #064482 !important">Пароль</b-form-text>
          <b-form-input class="cabinet_input" type="password" placeholder="Изменить"></b-form-input>
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
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect }) {
    if (!store.state.user.id) redirect("/");
    let user = JSON.parse(JSON.stringify(store.state.user));
    user.names = user.first_name + " " + user.last_name;

    return { user, loading: false };
  },
  methods: {
    previewFile(event) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);

      this.user.profile.photo = fileReader.result;
      console.log(this.user);
    },
    async exit() {
      await this.$router.push("/");

      document.cookie = `user_id= ; expires = ${new Date(0)}`;
      document.cookie = `token= ; expires = ${new Date(0)}`;

      this.$store.commit("setUser", {});
    },

    async save() {
      this.loading = true;

      let payload = {
        id: this.user.id,
        first_name: this.user.names.split(" ")[0],
        last_name: this.user.names.split(" ")[1],
        photo: this.user.profile.photo
      };

      for (let key in payload) {
        if (!payload[key]) delete payload[key];
      }

      try {
        await this.$store.dispatch("updateUser", payload);

        this.loading = false;
      } catch (error) {
        alert(error.message);

        this.loading = false;
      }
    }
  }
};
</script>

<style>
.image-uploader {
  height: 15rem;
  width: 100%;

  background-image: url("/img/logo.png");
  font-size: 0.00001px;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
</style>
