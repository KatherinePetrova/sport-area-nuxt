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
          <b-link :href="paylink">Сделать предоплату</b-link>
        </div>
        <div class="inf">
          <div
            class="main_image"
            :style="{backgroundImage: data.images[main_image] ? `url(${data.images[main_image].image})` : 'url(/img/whistle.png)'}"
          >
            <span>{{ data.location.address }}</span>
          </div>

          <div class="inputs-block">
            <span>Дата и время брони</span>
            <span class="input-group" v-if="booked.length > 0">
              <b-form-input
                disabled
                :value="`${booked[0].date}\t${booked[0].from_time}-${booked[booked.length-1].to_time}`"
              ></b-form-input>
            </span>
            <div style="margin-top: 2em">Итоговая стоимость</div>
            <span class="input-group">
              <b-form-input disabled :value="price.total + ' тг'"></b-form-input>
            </span>
            <div>Предоплата</div>
            <span class="input-group">
              <b-form-input disabled :value="price.pre + ' тг'"></b-form-input>
            </span>
            <div style="margin-top: 2em">Способ оплаты</div>
            <span class="input-group">
              <b-form-select disabled value="1">
                <option value="1">Картой</option>
              </b-form-select>
            </span>
            <div style="margin-top: 2em">Комментарий</div>
            <span class="input-group">
              <b-form-textarea id="textarea" rows="3" max-rows="6"></b-form-textarea>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import md5 from "~/service/md5.js";

export default {
  watch: {
    booked(newValue) {
      if (newValue.length == 0) {
        this.$router.go(-1);
      }
    }
  },
  beforeMount() {
    let cookie = document.cookie.split("; ");
    let objCookie = {};

    cookie.forEach(item => {
      objCookie[item.split("=")[0]] = item.split("=")[1];
    });

    if (objCookie.booked) {
      this.booked = JSON.parse(objCookie.booked);
    }

    if (objCookie.order_id) {
      this.order_id = objCookie.order_id;
    }
  },
  async asyncData({ store, query, redirect }) {
    if (!query.playground) redirect("/");

    await store.dispatch("getPlaycategories");
    await store.dispatch("getPlayground", query.playground);

    let data = JSON.parse(JSON.stringify(store.state.playground));
    let category = store.state.playcategories.find(
      item => item.id == data.category
    );

    return {
      data,
      category,
      main_image: 0,
      booked: [],
      order_id: null
    };
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
    paylink() {
      if (this.booked.length == 0) return;

      let pg_description =
        `${this.data.name}, ` +
        `${this.booked[0].date} ` +
        `${this.booked[0].from_time}-${this.booked[this.booked.length - 1].to_time}, ` +
        `${this.data.location.address}`;

      let success = {
        sum: this.price.pre,
        date: `${this.booked[0].date}`,
        time: `${this.booked[0].from_time}-${this.booked[this.booked.length - 1].to_time}`,
        name: this.data.name,
        address: this.data.location.address
      };

      let paybox = {
        pg_merchant_id: 517131,
        pg_description,
        pg_amount: this.price.pre,
        pg_order_id: this.order_id,
        pg_salt: "40d9fgdflgkdf8",
        pg_success_url: `${
          process.env.baseUrl
        }/cabinet?payment_success=${JSON.stringify(success)}`,
        pg_user_phone: this.user.profile.phone,
        pg_user_contact_email: this.user.email
      };

      let secret_key = "KyOKkJmCaDxPKmCU";

      let ordered = {};
      Object.keys(paybox)
        .sort()
        .forEach(function(key) {
          ordered[key] = paybox[key];
        });

      let sign = "payment.php;";
      for (let key in ordered) {
        sign += `${ordered[key]};`;
      }
      sign += secret_key;

      paybox.pg_sig = md5(sign);

      let result = "https://api.paybox.money/payment.php?";

      for (let key in paybox) {
        result += `${key}=${paybox[key]}&`;
      }

      return result;
    }
  },
  methods: {
    unbook(item) {
      let index = this.booked.findIndex(el => el.id == item.id);
      this.booked.splice(index, 1);
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

.book_button > a {
  background-color: #064482;
  color: white;
  text-decoration: none;

  border: none;

  padding: 0.75em 3.5em;

  border-radius: 5px;
}

.book_button > a:hover {
  background-color: #4783be;
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

  height: 17em;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  position: relative;

  margin-bottom: 4em;
  font-size: 2em;

  color: #707070;
}

.main_image > span {
  position: absolute;
  bottom: -3.5em;
}

.inf > .inputs-block {
  width: 48%;
  padding-right: 2em;
  position: relative;
}

.inputs-block > span.input-group {
  display: flex;
  align-items: center;
}

span.input-group > input {
  color: #064482 !important;
  margin: 0.5em;
}

span.input-group > select {
  color: #064482 !important;
  margin: 0.5em;
}

span.input-group > textarea {
  color: #064482 !important;
  margin: 0.5em;

  border: solid 1px #064482;
  border-radius: 0;
}

span.input-group > a {
  position: absolute;
  right: -2em;

  border: solid 1px #064482;
  border-radius: 50%;

  width: 2em;
  height: 2em;

  display: flex;
  justify-content: center;
  align-items: center;

  text-decoration: none;
  color: #064482 !important;
}

@media (max-width: 767px) {
  .playground_main {
    padding: 0;
  }

  .playground_main > .logo {
    margin: 0;
    margin-bottom: 0.5em;

    font-size: 3rem;
  }

  .playground_main > .body {
    padding: 3em 0;
  }

  .body > .book_button {
    width: 100%;

    padding: 0;
    left: 0;
  }

  .book_button > a {
    padding: 0.75em 0;
    width: calc(100% + 2px);

    text-align: center;
  }

  .body > .title {
    font-size: 2em;
    left: 0.5em;
  }

  .body > .inf {
    flex-direction: column;
  }

  .inf > div {
    width: 100% !important;
    max-width: 100% !important;
  }

  .inf > .main_image {
    height: 10em;
    margin-bottom: 5em;
  }

  .inf > .main_image {
    font-size: 1rem;
    padding: 0 1em;
  }

  .inf > .inputs-block {
    padding: 0 1em;
  }
}
</style>
