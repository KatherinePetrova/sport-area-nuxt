<template>
  <div class="add-playground-main">
    <div class="logo">{{ user.profile ? user.profile.organization.toUpperCase(): 'нет данных' }}</div>
    <div class="body">
      <div class="form">
        <div class="title">Добавить объект</div>
        <div class="save" @click="save()">СОХРАНИТЬ</div>

        <b-form-input
          placeholder="Введите название объекта"
          v-model="models.name"
          :state="models.name == error_label ? false : null"
          @focus="models.name == error_label ? models.name = null : models.name = models.name"
        ></b-form-input>

        <b-form-select
          v-model="models.type"
          :state="models.type == error_label ? false : null"
          @focus="models.type == error_label ? models.type = null : models.type = models.type"
        >
          <option :value="error_label" v-if="models.type == error_label" disabled>{{ error_label }}</option>
          <option :value="null" disabled>Введите тип площадки</option>
          <option value="open">открытое поле</option>
          <option value="close">крытое поле</option>
        </b-form-select>

        <b-input-group class="size">
          <label>Размер объекта</label>
          <b-form-input
            placeholder="Ширина"
            type="number"
            v-model="models.width"
            :state="models.width == error_label ? false : null"
            @focus="models.width == error_label ? models.width = null : models.width = models.width"
          ></b-form-input>
          <b-form-input
            placeholder="Длина"
            type="number"
            v-model="models.length"
            :state="models.length == error_label ? false : null"
            @focus="models.length == error_label ? models.length = null : models.length = models.length"
          ></b-form-input>
        </b-input-group>

        <b-form-select
          v-model="models.city"
          :state="models.city == error_label ? false : null"
          @focus="models.city == error_label ? models.city = null : models.city = models.city"
        >
          <option :value="error_label" v-if="models.city == error_label" disabled>{{ error_label }}</option>
          <option :value="null" disabled>Выберите город</option>
          <option
            v-for="(item, index) in data.cities"
            :key="'cityOption' + index"
            :value="item.id"
          >{{ item.name }}</option>
        </b-form-select>

        <b-form-select
          v-model="models.category"
          :state="models.category == error_label ? false : null"
          @focus="models.category == error_label ? models.category = null : models.category = models.category"
        >
          <option
            :value="error_label"
            v-if="models.category == error_label"
            disabled
          >{{ error_label }}</option>
          <option :value="null" disabled>Выберите тип спорта</option>
          <option
            v-for="(item, index) in data.playcategories"
            :key="'playOption' + index"
            :value="item.id"
          >{{ item.name }}</option>
        </b-form-select>

        <b-form-input
          placeholder="Адрес объекта"
          v-model="models.location.address"
          :state="models.location.address == error_label ? false : null"
          disabled
        ></b-form-input>

        <div class="map">
          <label>Укажите расположение на карте</label>
          <div>
            <template v-if="data.cities.find(item=> item.id == models.city) && !map.picked">
              <img src="/img/marker.png" alt />
              <b-button @click="pickLocation">Выбрать</b-button>
            </template>
            <label style="font-size: 1.5em; text-align: center" v-else>Сначала нужно выбрать город</label>

            <no-ssr>
              <yandex-map
                :coords="
                  map.value ? map.value :
                  [
                    data.cities.find(item=> item.id == models.city).latitude,
                    data.cities.find(item=> item.id == models.city).longitude
                  ]
                "
                style="width: 100%; height: 100%; position: absolute"
                zoom="13"
                v-if="data.cities.find(item=> item.id == models.city)"
                ref="map"
              ></yandex-map>
            </no-ssr>

            <transition name="shade">
              <div class="cover" v-if="map.picked">
                <label>Расположение указано</label>
                <b-button @click="map.picked = false">Перевыбрать</b-button>
              </div>
            </transition>
          </div>
        </div>

        <div class="infrastructure">
          <label>Инфраструктура*</label>
          <b-form-checkbox class="point" v-model="models.is.coach">Тренер</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.bathroom">Ванные комнаты</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.dressroom">Раздевалки</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.parking">Парковка</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.lights">Прожектора</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.shower">Душ</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.tribunes">Трибуны</b-form-checkbox>
          <b-form-checkbox class="point" v-model="models.is.sauna">Сауна</b-form-checkbox>
        </div>

        <b-form-input
          placeholder="Тип покрытия"
          v-model="models.cover_type"
          :state="models.cover_type == error_label ? false : null"
          @focus="models.cover_type == error_label ? models.cover_type = null : models.cover_type = models.cover_type"
        ></b-form-input>

        <b-form-input
          type="number"
          placeholder="Процент предоплаты"
          v-model="models.prepay"
          :state="models.prepay == error_label ? false : null"
          @focus="models.prepay == error_label ? models.prepay = null : models.prepay = models.prepay"
        ></b-form-input>

        <b-form-textarea
          placeholder="Инвентарь"
          v-model="models.inventory"
          :state="models.inventory == error_label ? false : null"
          @focus="models.inventory == error_label ? models.inventory = null : models.inventory = models.inventory"
        ></b-form-textarea>
        <b-form-textarea
          placeholder="Описание площадки"
          v-model="models.description"
          :state="models.description == error_label ? false : null"
          @focus="models.description == error_label ? models.description = null : models.description = models.description"
        ></b-form-textarea>

        <div class="img">
          <label>Добавить изображения и видео</label>
          <div class="image-uploader">
            <label style="margin-top: -0.3em">+</label>
            <input type="file" @change="addImage" />
          </div>

          <template v-if="imagesModel.length > 0">
            <label style="font-size: 1rem; color: #064482; margin-top: 1em">Предпросмотр</label>
            <b-carousel
              controls
              background="#f1f9ff"
              indicators
              style="height: 15rem; display: flex; justify-content: center; align-items: center; overflow: hidden"
              class="carousel"
              img-width="100%"
              v-if="imagePicked"
            >
              <b-carousel-slide
                :img-src="item.src"
                v-for="(item, index) in imagesModel"
                :key="'imageModelImage' + index"
              ></b-carousel-slide>
            </b-carousel>
          </template>
        </div>

        <!-- <b-form-input placeholder="Добавить ссылку на видео"></b-form-input> -->
      </div>
      <div class="form">
        <div class="title" style="font-size: 16px">Укажите время работы и стоимость</div>
        <div class="save mobile_save" @click="save()">СОХРАНИТЬ</div>

        <label style="margin: 0; color: #064482">Время работы в будние дни</label>
        <b-input-group class="size time">
          <label style="width: 3em; margin: 0 0.5em">От</label>
          <b-form-select
            v-model="timeModel.time_from_common_days"
            :state="models.time_from_common_days == error_label ? false : null"
            @change="models.time_from_common_days = null"
          >
            <option :value="null" disabled>ЧЧ/ММ</option>
            <option
              :value="item"
              v-for="(item, index) in date.times"
              :key="'timeOption'+ index"
            >{{ item }}</option>
          </b-form-select>
          <label style="width: 3em; margin: 0 0.5em">до</label>
          <b-form-select
            v-model="timeModel.time_to_common_days"
            :state="models.time_to_common_days == error_label ? false : null"
            @change="models.time_to_common_days = null"
          >
            <option :value="null" disabled>ЧЧ/ММ</option>
            <option
              :value="item"
              v-for="(item, index) in date.times"
              :key="'timeOption'+ index * date.times.length"
            >{{ item }}</option>
          </b-form-select>
        </b-input-group>

        <label style="margin: 0; color: #064482">Время работы в выходные дни</label>
        <b-input-group class="size time">
          <label style="width: 3em; margin: 0 0.5em">От</label>
          <b-form-select
            v-model="timeModel.time_from_holiday_days"
            :disabled="!date.every"
            :state="models.time_from_holiday_days == error_label ? false : null"
            @change="models.time_from_holiday_days = null"
          >
            <option :value="null" disabled>ЧЧ/ММ</option>
            <option
              :value="item"
              v-for="(item, index) in date.times"
              :key="'timeOption'+ index * date.times.length+1"
            >{{ item }}</option>
          </b-form-select>
          <label style="width: 3em; margin: 0 0.5em">до</label>
          <b-form-select
            v-model="timeModel.time_to_holiday_days"
            :disabled="!date.every"
            :state="models.time_to_holiday_days == error_label ? false : null"
            @change="models.time_to_holiday_days = null"
          >
            <option :value="null" disabled>ЧЧ/ММ</option>
            <option
              :value="item"
              v-for="(item, index) in date.times"
              :key="'timeOption'+ index * date.times.length+2"
            >{{ item }}</option>
          </b-form-select>
        </b-input-group>

        <b-form-select v-model="date.every">
          <option :value="true">Указывать каждый день</option>
          <option :value="false">Указать все дни</option>
        </b-form-select>

        <div class="days" v-if="date.every">
          <div
            :class="{active: date.selected == index}"
            v-for="(item, index) in date.weekDays"
            :key="index + 'day' +index"
            @click="date.selected = index"
          >{{ item }}</div>
        </div>

        <!-- <div class="open" v-if="date.every">
          <div @click="date.dates[date.selected].open = !date.dates[date.selected].open">
            <div class="toggle" :class="{'toggle-2': !selectedDates.open}"></div>
          </div>
          <label>{{ selectedDates.open ? 'открыто' : 'закрыто' }}</label>
        </div>-->

        <label style="margin: 0; color: #064482">Указать временные промежутки и стоимость</label>
        <b-input-group
          class="size breaks"
          v-for="(itemy, indexy) in date.gaps[date.selected]"
          :key="'gaps' + indexy"
        >
          <div>
            <label style="width: 3em; margin: 0 0.5em">От</label>
            <b-form-select v-model="itemy.from" :state="itemy.from">
              <option :value="null" disabled>ЧЧ/ММ</option>
              <option
                :value="item"
                v-for="(item, index) in times[indexy]"
                :key="'gapOption'+ index * date.times.length+1"
              >{{ item }}</option>
            </b-form-select>
          </div>

          <div>
            <label style="width: 3em; margin: 0 0.5em">до</label>
            <b-form-select v-model="itemy.to" :state="itemy.to">
              <option :value="null" disabled>ЧЧ/ММ</option>
              <option
                :value="item"
                v-for="(item, index) in times[indexy]"
                :key="'gapOption'+ index * date.times.length+2"
              >{{ item }}</option>
            </b-form-select>
          </div>

          <b-form-input placeholder="Цена" type="number" v-model="itemy.price" :state="itemy.price"></b-form-input>
        </b-input-group>
        <b-button
          v-if="addButton"
          @click="date.gaps[date.selected].push({ from: null, to: null, price: null })"
        >Добавить промежуток</b-button>
      </div>
    </div>
  </div>
</template>
<script>
let weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
let times = [];

let hour = 0;
let minute = 0;

while (hour <= 23) {
  let hourStr = hour >= 10 ? hour : `0${hour}`;
  let minuteStr = minute >= 10 ? minute : `0${minute}`;

  times.push(`${hourStr}:${minuteStr}`);

  minute += 30;
  if (minute > 30) {
    minute = 0;
    hour++;
  }
}

let gaps = [];

weekDays.forEach((item, index) => {
  gaps.push([{ from: null, to: null, price: null }]);
});

export default {
  watch: {
    "date.every"(newValue) {
      if (!newValue) {
        this.date.selected = 0;

        this.timeModel.time_from_holiday_days = this.timeModel.time_from_common_days;
        this.timeModel.time_to_holiday_days = this.timeModel.time_to_common_days;
      }
    },
    "timeModel.time_from_common_days"(newValue) {
      if (!this.date.every) {
        this.timeModel.time_from_holiday_days = newValue;
      }
    },
    "timeModel.time_to_common_days"(newValue) {
      if (!this.date.every) {
        this.timeModel.time_to_holiday_days = newValue;
      }
    },
    "date.gaps": {
      deep: true,
      handler(newValue) {
        let gap = JSON.parse(JSON.stringify(newValue[this.date.selected]));
        let times = JSON.parse(JSON.stringify(this.times[gap.length - 1]));

        if (times.length < 2) {
          this.date.gaps[this.date.selected].splice(gap.length - 1, 1);
        }
      }
    }
  },
  computed: {
    addButton() {
      let gap = this.date.gaps[this.date.selected];
      let times = this.times[gap.length - 1];

      if (gap[gap.length - 1].to == times[times.length - 1]) {
        return false;
      } else {
        return true;
      }
    },

    user() {
      return this.$store.state.user;
    },

    times() {
      let gap = this.date.gaps[this.date.selected];

      let result = [];

      gap.forEach((item, index) => {
        let time = { from: null, to: null };
        let dayType = this.date.selected < 5 ? "common" : "holiday";

        for (let key in time) {
          time[key] = this.timeModel[`time_${key}_${dayType}_days`];
        }

        if (index > 0) {
          time.from = this.date.gaps[this.date.selected][index - 1].to;
        }

        let indexes = { from: null, to: null };
        for (let key in indexes) {
          indexes[key] = this.date.times.findIndex(item => time[key] == item);
        }

        result.push(this.date.times.slice(indexes.from, indexes.to + 1));
      });

      return result;
    }
  },
  methods: {
    addImage(event) {
      try {
        this.imagePicked = false;

        let reader = new FileReader();
        let input = event.target;

        let imageObject = {};

        reader.onload = e => {
          imageObject.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
        imageObject.file = input.files[0];

        this.imagesModel.push(imageObject);

        setTimeout(() => {
          this.imagePicked = true;
        }, 100);
      } catch (e) {}
    },

    async save() {
      try {
        for (let key in this.timeModel) {
          this.models[key] = this.timeModel[key];
          this.models["work_" + key] = this.timeModel[key];
        }

        // validation
        let error = [];
        for (let key in this.models) {
          if (
            (this.models[key] == null ||
              this.models[key] == false ||
              this.models[key] == this.error_label) &&
            (!key.includes("schedule") && !key.includes("cost"))
          ) {
            error.push(key);
          }
        }

        if (error.length > 0) {
          throw { type: "models", error };
        }

        let gaps_error = [];
        let gaps = JSON.parse(JSON.stringify(this.date.gaps));
        let limit = this.date.every ? gaps.length : 1;
        for (let i = 0; i < limit; i++) {
          for (let j = 0; j < gaps[i].length; j++) {
            let fields = [];
            for (let key in gaps[i][j]) {
              if (gaps[i][j][key] == null || gaps[i][j][key] == false) {
                fields.push(key);
              }
            }
            if (fields.length > 0) {
              gaps_error.push({ coords: { i, j }, fields });
            }
          }
        }

        if (gaps_error.length > 0) {
          throw { type: "gaps", error: gaps_error };
        }

        let is = this.models.is;

        for (let key in is) {
          this.models["is_" + key] = is[key];
        }

        // booking table constructing
        let times = this.date.times;

        if (!this.date.every) {
          for (let i = 1; i < gaps.length; i++) {
            gaps[i] = JSON.parse(JSON.stringify(gaps[0]));
          }
        }

        for (let i = 0; i < gaps.length; i++) {
          for (let j = 0; j < gaps[i].length - 1; j++) {
            if (gaps[i][j].to != gaps[i][j + 1].from) {
              gaps[i].splice(j + 1, 0, {
                from: gaps[i][j].to,
                to: gaps[i][j + 1].from,
                price: 0
              });
            }
          }
        }

        let cost = 999999;
        for (let i = 0; i < gaps.length; i++) {
          for (let j = 0; j < gaps[i].length; j++) {
            this.models.schedule.push({
              day: i + 1,
              from_time: gaps[i][j].from,
              to_time: gaps[i][j].to,
              price: parseInt(gaps[i][j].price)
            });

            if (gaps[i][j].price && cost > gaps[i][j].price) {
              cost = gaps[i][j].price;
            }
          }
        }

        this.models.cost = cost;

        let payload = {};
        for (let key in this.models) {
          if (key != "is") {
            payload[key] = this.models[key];
          }
        }

        await this.$store.dispatch("addPlayground", {
          payload,
          form: this.imagesModel
        });

        this.$store.commit("setSuccess", {
          show: true,
          message:
            "Объект успешно добавлен! Вы можете посмотреть статус объекта в личном кабинете."
        });

        this.$router.push("/cabinet");
      } catch (e) {
        if (e.type == "models") {
          let { error } = e;
          error.forEach(item => {
            this.models[item] = this.error_label;
          });

          window.scrollTo({ top: 200, behavior: "smooth" });
        } else if (e.type == "gaps") {
          let { error } = e;

          error.forEach(item => {
            let { coords } = item;

            item.fields.forEach(key => {
              this.date.gaps[coords.i][coords.j][key] = false;
            });
          });

          window.scrollTo({ top: 200, behavior: "smooth" });
        } else {
          alert("Ошибка, попробуйте перезагрузить страницу");
          console.log(e);
        }
      }
    },

    async pickLocation() {
      let map = this.$refs.map;
      let center = map.myMap._yandexState._model.center;

      this.map.value = center;

      let geoCoder = await ymaps.geocode(center);
      let address = geoCoder.geoObjects
        .get(0)
        .properties.get("metaDataProperty").GeocoderMetaData.text;

      this.models.location.address = address;
      this.models.location.latitude = this.map.value[0].toFixed(10);
      this.models.location.longitude = this.map.value[1].toFixed(10);

      this.map.picked = true;
    }
  },
  async asyncData({ store }) {
    let cities = await store.dispatch("getCities");
    let playcategories = await store.dispatch("getPlaycategories");

    return {
      error_label: "Заполните это поле",

      imagePicked: false,
      imagesModel: [],

      timeModel: {
        time_from_common_days: null,
        time_to_common_days: null,
        time_from_holiday_days: null,
        time_to_holiday_days: null
      },

      data: { cities, playcategories },
      map: { value: null, picked: false },
      date: { weekDays, times, every: true, selected: 0, gaps },
      models: {
        name: null,
        category: null,
        city: null,

        location: {
          latitude: null,
          longitude: null,

          address: null
        },

        time_from_common_days: null,
        time_to_common_days: null,
        time_from_holiday_days: null,
        time_to_holiday_days: null,

        work_time_from_common_days: null,
        work_time_to_common_days: null,
        work_time_from_holiday_days: null,
        work_time_to_holiday_days: null,

        prepay: null,
        type: null,
        cover_type: null,

        width: null,
        length: null,

        description: null,
        inventory: null,

        is: {
          coach: false,
          bathroom: false,
          dressroom: false,
          parking: false,
          lights: false,
          shower: false,
          tribunes: false,
          sauna: false
        },

        schedule: [],
        cost: null
      }
    };
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

.form > .size {
  display: flex !important;
  flex-wrap: initial !important;
}

.size > * {
  width: 100%;
}

.size > label {
  margin: 0;
  margin-right: 1em;

  display: flex;
  align-items: center;

  color: #064482;
}

.form > .breaks > div {
  display: flex;
  align-items: center;

  margin-bottom: 0.5em;
}

.breaks > input {
  margin-left: 1em;
}

.breaks > div > label {
  display: flex;
  justify-content: center;

  width: 3em;
  margin: 0 0.5em;
}

.form > .time {
  width: 70%;
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

  transition: 0.1s;
}

div > .toggle-2 {
  right: calc(3em - 1.35em - 1px);
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

.form > .mobile_save {
  display: none;
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

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  color: #064482;

  overflow: hidden;
  position: relative;
}

.map > div > button {
  position: absolute;

  bottom: 1em;
  z-index: 3;
}

.map > div > img {
  height: 3em;

  position: absolute;
  z-index: 3;
}

.map > div > .cover {
  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.16);
  color: white;

  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;
  font-weight: bold;
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

.img > .carousel {
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  height: 15rem;
  width: 100%;

  border: solid 1px #064482;
}

.img > .image-uploader {
  font-size: 12rem;

  height: 1em;
  width: 100%;

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

  .form > .breaks {
    flex-direction: column;
  }

  .breaks > input {
    margin: 0;
  }

  .form > .title {
    font-size: 1.25rem;
  }

  .form > .time {
    width: 100%;
  }

  .form > .save {
    display: none;
  }

  .form > .mobile_save {
    display: block;
  }

  .days > div {
    font-size: 1.5em;
  }
}
</style>
