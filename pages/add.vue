<template>
  <div class="add-playground-main">
    <div class="logo">{{ user.profile ? user.profile.organization.toUpperCase(): 'нет данных' }}</div>
    <div class="body">
      <div class="form">
        <div class="title">Добавить объект</div>
        <div class="save" @click="save()">СОХРАНИТЬ</div>
        <b-form-input placeholder="Введите название объекта"></b-form-input>
        <b-form-select :value="null">
          <option :value="null">Введите тип площадки</option>
        </b-form-select>
        <b-form-input placeholder="Введите размер объекта"></b-form-input>
        <b-form-select v-model="location.city">
          <option :value="null" disabled>Выберите город</option>
          <option
            v-for="(item, index) in cities"
            :key="'cityOption' + index"
            :value="item"
          >{{ item.name }}</option>
        </b-form-select>
        <b-form-input placeholder="Введите адрес объекта"></b-form-input>
        <b-form-input placeholder="Номер телефона"></b-form-input>
        <b-form-input placeholder="Контактное лицо"></b-form-input>
        <div class="map">
          <label>Укажите расположение на карте</label>
          <div>
            <no-ssr>
              <yandex-map
                :coords="[location.city.latitude, location.city.longitude]"
                style="width: 100%; height: 100%;"
                zoom="13"
                v-if="location.city"
              ></yandex-map>
            </no-ssr>
          </div>
        </div>
        <div class="infrastructure">
          <label>Инфраструктура*</label>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point">Трибуны</b-form-checkbox>
        </div>
        <b-form-textarea placeholder="Добавить описание владельца"></b-form-textarea>
        <div class="img">
          <label>Добавить изображения и видео</label>
          <div class="image-uploader">
            <label style="margin-top: -0.3em">+</label>
            <input type="file" />
            <img src />
          </div>
        </div>
        <b-form-input placeholder="Добавить ссылку на видео"></b-form-input>
      </div>
      <div class="form">
        <div class="title" style="font-size: 16px">Укажите время работы и стоимость</div>
        <b-form-select v-model="every">
          <option :value="true">Каждый день</option>
          <option :value="false">Не каждый день</option>
        </b-form-select>
        <div class="days">
          <div
            :class="{active: selected == index}"
            v-for="(item, index) in dates"
            :key="index + 'day' +index"
            @click="every ? selected = index : select = 0"
          >{{ item.day }}</div>
        </div>
        <div class="open">
          <div @click="dates[selected].open = !dates[selected].open">
            <div class="toggle" :class="{'toggle-2': !selectedDates.open}"></div>
          </div>
          <label>{{ selectedDates.open ? 'открыто' : 'закрыто' }}</label>
        </div>
        <div class="time">
          <div class="header">
            <b-form-select v-model="dates[selected].from">
              <option
                v-for="(item, index) in dates[selected].times.slice(0, dates[selected].times.length-1)"
                :key="'fromOption' + index"
                :value="item.title"
              >{{ item.title }}</option>
            </b-form-select>
            <label>&ndash;</label>
            <b-form-select v-model="dates[selected].to">
              <option
                v-for="(item, index) in dates[selected].times.slice(1, dates[selected].times.length)"
                :key="'toOption' + index"
                :value="item.title"
              >{{ item.title }}</option>
            </b-form-select>
          </div>
          <div
            class="header content"
            v-for="(item, index) in selectedDates.times"
            :key="'time' + index"
          >
            <b-form-input
              disabled
              class="nani"
              :style="{
                borderBottomStyle: index == selectedDates.times.length-1 ? 'solid !important' : 'none !important', 
                borderTopStyle: index == 0 ? 'solid !important' : 'none !important'
              }"
              :value="item.title"
            ></b-form-input>
            <label>&ndash;</label>
            <b-form-input v-model="dates[selected].times[index].value" place></b-form-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import days from "~/service/days.json";

let weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
let dates = [];
weekDays.forEach(item => {
  dates.push({
    day: item,
    times: JSON.parse(JSON.stringify(days)),
    from: days[0].title,
    to: days[days.length - 1].title,
    open: true
  });
});

export default {
  async asyncData({ store }) {
    let cities = await store.dispatch("getCities");

    return {
      dates,
      selected: 0,
      every: true,
      cities,
      location: { city: null }
    };
  },
  watch: {
    every(newValue) {
      if (!newValue) {
        this.selected = 0;
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    selectedDates() {
      let result = JSON.parse(JSON.stringify(this.dates[this.selected]));

      let fromIndex = result.times.findIndex(item => {
        return item.title == result.from;
      });
      let toIndex = result.times.findIndex(item => {
        return item.title == result.to;
      });

      if (fromIndex >= toIndex) {
        try {
          this.dates[this.selected].from = this.dates[this.selected].times[
            toIndex - 2
          ].title;

          fromIndex = toIndex - 2;
        } catch (error) {
          this.dates[this.selected].to = this.dates[this.selected].times[
            fromIndex + 2
          ].title;

          toIndex = fromIndex + 2;
        }
      }

      result.times = result.times.slice(fromIndex, toIndex + 1);

      return result;
    }
  },
  methods: {
    save() {
      this.$store.dispatch("addPlayground", { location: this.location });
    }
  }
};
</script>
<style scoped>
.add-playground-main {
  padding: 1em;
}

.add-playground-main > .logo {
  font-size: 5em;
  padding: 0.75em;

  border-radius: 36px;

  background-image: url("/img/soccer.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.44;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

  margin-bottom: 0.5em;
}

.add-playground-main > .body {
  padding: 0 3em;

  display: flex;
  justify-content: space-between;
}

.body > .form {
  width: 48%;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  padding: 3em 2em;

  position: relative;

  margin-bottom: 2em;

  display: flex;
  flex-direction: column;

  height: 1%;
}

.form > * {
  margin-bottom: 1.5em;
  font-size: 1rem;
}

.form > .time {
  width: 60%;
}

.time > div {
  display: flex;
}

.time > .header {
  margin-bottom: 1em;
}

.header > select {
  margin: 0 0.5em;
  font-size: 1.25em;

  text-align: center;
  color: #064482;
}

.header > input {
  margin: 0 0.5em;
  font-size: 1.25em;

  text-align: center;
  color: #064482;
}

.header > label {
  margin: 0;
  margin-top: 0.6em;
}

.time > .content {
  margin-bottom: -1px;
}

.content > label {
  opacity: 0;
}

.content > .nani {
  background-color: white;
  border-bottom-style: none !important;
  border-top-style: none !important;
}

.form > .open {
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

  transition: 0.5s;
}

div > .toggle-2 {
  right: auto;
  left: 1px;
}

.open > label {
  margin: 0;
  margin-left: 0.5em;
}

.form > .days {
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

.form > textarea {
  border: solid 1px #064482;
  border-radius: 0;

  min-height: 10em;
}

::placeholder {
  color: #064482 !important;
  opacity: 1 !important;
  font-size: 1rem !important;
}

.form > .title {
  position: absolute;

  padding: 0.5em 1em;
  background-color: white;

  top: -1.25em;
  left: 3em;

  color: #064482;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;

  font-size: 2em;
}

.form > .save {
  position: absolute;

  bottom: -3em;
  left: calc(50% - (8em));

  background-color: #064482;
  color: white;

  font-weight: bold;

  padding: 1em 5em;

  border-radius: 7px;

  cursor: pointer;
}

.form > .save:hover {
  background-color: #335d88;
}

.map > label {
  color: #064482;
  font-size: 0.9em;
}

.map > div {
  height: 20em;
  width: 100%;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  overflow: hidden;
}

.form > .infrastructure {
  color: #064482 !important;
  margin-bottom: 2em;
}

.infrastructure > label {
  font-size: 0.9em;
  width: 100%;
}

.infrastructure > .point {
  float: left;

  margin-bottom: 0.5em;

  width: 10rem;
}

.img > label {
  color: #064482;

  font-size: 1.5em;
  opacity: 0.5;
}

.img > .image-uploader {
  font-size: 15vw;

  height: 1em;
  width: 70%;

  border: solid 1px #064482;
  color: #064482;

  background-color: #f1f9ff;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  overflow: hidden;
}

.image-uploader > img {
  width: 100%;

  position: absolute;
}

.image-uploader > input {
  height: 100%;
  width: 100%;

  z-index: 1;

  opacity: 0;
  position: absolute;
}

@media (max-width: 767px) {
  .add-playground-main {
    padding: 0;
  }

  .add-playground-main > .logo {
    font-size: 3rem;
  }

  .add-playground-main > .body {
    flex-direction: column;
    padding: 0;
  }

  .body > .form {
    width: 100%;
  }

  .form > .title {
    font-size: 1.25rem;
  }

  .form > .time {
    width: 100%;
  }

  .days > div {
    font-size: 1.5em;
  }
}
</style>
