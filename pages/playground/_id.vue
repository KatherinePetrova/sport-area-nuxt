<template>
  <div class="playground_main">
    <div
      class="logo"
      :style="{backgroundImage: `url(${category.photo})`}"
    >{{ category.name.toUpperCase() }}</div>
    <div class="body">
      <div class="title">{{ data.name }}</div>
      <div class="inf">
        <div class="main_image" :style="{backgroundImage: `url(${data.images[main_image].image})`}"></div>
        <div style="width: 48%">
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
            :style="{marginRight: (index + 1)%3==0 ? '0' : '5%', backgroundImage: `url(${item.image})`}"
            :class="{active: main_image==index}"
            @click="main_image=index"
          ></div>
        </div>
        <div class="map"></div>
      </div>
      <div class="booking" @click="createTable()">
        <div class="title">Бронирование</div>
        <table border="1">
          <caption>Бронирование</caption>
          <tr>
            <td v-for="(item, index) in createTable()" :key="'cell' + index">{{ item.title }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, params }) {
    await store.dispatch("getPlaycategories");
    await store.dispatch("getPlayground", params.id);

    let data = JSON.parse(JSON.stringify(store.state.playground));
    let category = store.state.playcategories.find(
      item => item.id == data.category
    );

    return {
      data,
      category,
      main_image: 0,
      days: [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
      ]
    };
  },
  head() {
    return {
      title: this.data.name + " | Онлайн бронирование спортивных площадок"
    };
  },
  methods: {
    structure() {
      let result = "";
      for (let key in this.data) {
        if (key.includes("is") && this.data[key]) {
          result += key.substr(3, key.length) + ", ";
        }
      }

      return result.substr(0, result.length - 2);
    },

    createTable() {
      let data = JSON.parse(JSON.stringify(this.data.days));
      data.forEach(item => {
        item.date = new Date(item.date);
        item.title =
          this.days[item.date.getDay()] +
          "<br>" +
          (item.date.getDate() > 10
            ? item.date.getDate()
            : "0" + item.date.getDate()) +
          "." +
          (item.date.getMonth() + 1 > 10
            ? item.date.getMonth() + 1
            : "0" + (item.date.getMonth() + 1));
      });

      data.sort((a, b) => {
        if (a.date.getTime() < b.date.getTime()) {
          return -1;
        }
      });

      data.unshift({ title: "Назад" });
      data.push({ title: "Далее" });

      return data;
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
.body > .inf {
  width: 100%;

  display: flex;
  justify-content: space-between;

  margin-bottom: 3em;
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

td {
  width: 7em;
  padding: 0.5em 0;
  text-align: center;

  color: #074582;
}
</style>
