<template>
  <div class="search_main">
    <transition name="page">
      <div
        v-if="playcategories.find(item => item.id == $route.query.category)"
        :style="{backgroundImage: `url(${playcategories.find(item => item.id == $route.query.category).photo})`}"
        class="logo"
      >{{ playcategories.find(item => item.id == $route.query.category).name.toUpperCase() }}</div>
    </transition>
    <div class="filter">
      <button @click="search()">ПРИМЕНИТЬ ФИЛЬТР</button>
      <div class="title">Фильтр</div>

      <div class="block">
        <b-form-select v-model="filter.category">
          <option disabled :value="null">Вид спорта</option>
          <option
            v-for="(item, index) in playcategories"
            :key="index+'playcategories'"
            :value="item.id"
          >{{item.name}}</option>
        </b-form-select>
        <b-form-select v-model="filter.type">
          <option disabled :value="null">Тип площадки</option>
          <option value="closed">крытое поле</option>
          <option value="open">открытое поле</option>
        </b-form-select>
        <div class="time">
          <span>Предположительное время игры</span>
          <span>
            с
            <b-form-input v-model="filter.time_from" placeholder="ЧЧ/ММ" v-mask="'##/##'"></b-form-input>до
            <b-form-input
              v-model="filter.time_to"
              placeholder="ЧЧ/ММ"
              style="margin: 0 0.5em"
              v-mask="'##/##'"
            ></b-form-input>
          </span>
        </div>
        <div class="time">
          <span>Стоимость, т</span>
          <span>
            от
            <b-form-input v-model="filter.cost_from" type="number"></b-form-input>до
            <b-form-input v-model="filter.cost_to" type="number"></b-form-input>
          </span>
        </div>
        <b-form-select v-model="filter.order_by">
          <option disabled :value="null">Упорядочить</option>
          <option value="new">По дате - сначала новые</option>
          <option value="old">По дате - сначала старые</option>
          <option value="cost_inc">По цене - возрастанию</option>
          <option value="cost_dec">По цене - убыванию</option>
        </b-form-select>
        <b-form-select v-model="filter.city">
          <option :value="null" disabled>Выберите город</option>
          <option
            :value="item.id"
            v-for="(item, index) in cities"
            :key="'city-option' + index"
          >{{ item.name }}</option>
        </b-form-select>
      </div>
      <div class="block">
        <div class="title">Инфраструктура*</div>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_coach"
        >Тренер</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_bathroom"
        >Туалет</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_tribunes"
        >Трибуны</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_lights"
        >Освещение</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_dressroom"
        >Раздевалки</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_sauna"
        >Сауна</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_shower"
        >Душевая</b-form-checkbox>
        <b-form-checkbox
          style="display: flex; align-items: center"
          class="checkbox"
          v-model="filter.is_parking"
        >Парковка</b-form-checkbox>
        <a href="/" @click.prevent="clearSearch()" style>Сбросить фильтр</a>
      </div>
    </div>
    <div class="result">
      <div class="total" :class="{ map }">
        <div class="title">
          <button :class="{active: !map}" @click="map = false">Список</button>
          <button :class="{active: map}" @click="map = true">Карта</button>
        </div>
        <template v-if="!map">
          <transition name="page" mode="in-out">
            <span v-if="loading" style="color:#064482; font-size: 1.5em ">Загрузка...</span>
            <span
              v-if="searchResults.length == 0 && !loading"
              style="color:#064482; font-size: 1.5em "
            >Ничего не найдено</span>
          </transition>
          <div class="pole_block" v-for="(item, index) in searchResults" :key="index + 'search'">
            <div
              class="img"
              :style="{backgroundImage: item.images.length > 0 ? `url(${item.images[0].image})` : '/img/logo.png'}"
            ></div>

            <div class="content">
              <span style="font-size: 1.5em">{{ item.name }}</span>
              <span style="font-size: 1.5em">{{ `от ${item.cost*2} тг/ч` }}</span>
              <span>{{ `Адрес - ${item.location.address.substr(11, item.location.address.length - 1)}` }}</span>
              <span>{{ `Тип - ${item.type=='open' ? 'открытое поле' : 'крытое поле' }` }}</span>
              <span
                style="margin-bottom: 1em"
              >{{ `Размеры - ${Math.round(item.length)}х${Math.round(item.width)} м` }}</span>
              <nuxt-link :to="`/playground/${item.id}`">Подробнее</nuxt-link>
            </div>
          </div>
        </template>
        <no-ssr v-else>
          <yandex-map
            :coords="mapCenter"
            style="width: 100%; height: 100%;"
            zoom="12"
            :cluster-options="clusterOptions"
          >
            <ymap-marker
              :marker-id="item.location.id"
              :coords="[item.location.latitude, item.location.longitude]"
              v-for="(item, index) in searchResults"
              :key="'ymapmarker' + index"
              :balloon-template="balloon(item)"
              :icon="{ 
                imageHref: '/img/marker.png', 
                layout: 'default#imageWithContent', 
                imageSize: [28, 33],
                imageOffset: [-14, -16], 
              }"
              cluster-name="1"
            ></ymap-marker>
          </yandex-map>
        </no-ssr>
        <div class="pagination" v-if="page.count && page.count > 1">
          <div class="pages">
            <div
              v-if="$route.params.page != 1"
              @click="$router.push({ params: { page: parseInt(page.page) - 1 }, query: $route.query })"
            >Назад</div>
            <div
              @click="$router.push({ params: { page: item }, query: $route.query })"
              v-for="item in page.count"
              :key="'page' + item"
              :class="{active: item == page.page}"
              style="font-weight: 600"
              v-show="$route.params.page > item - 3 && $route.params.page < item + 3 || item == page.count || item == 1 "
            >{{ item }}</div>
            <div
              v-if="$route.params.page != page.count"
              @click="$router.push({ params: { page: parseInt(page.page) + 1 }, query: $route.query })"
            >Дальше</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, params, redirect }) {
    await store.dispatch("getPlaycategories");
    let cities = await store.dispatch("getCities");

    store.commit("setPages", { search: { page: params.page } });

    return { cities };
  },
  data() {
    return {
      map: false,
      loading: false,
      filter: {
        category: null,
        is_coach: false,
        is_parking: false,
        is_shower: false,
        is_lights: false,
        is_bathroom: false,
        is_dressroom: false,
        is_tribunes: false,
        is_sauna: false,
        type: null,
        order_by: null,
        time_from: null,
        time_to: null,
        cost_from: null,
        cost_to: null,
        city: null
      },

      clusterOptions: {
        "1": {
          clusterDisableClickZoom: false,
          clusterOpenBalloonOnClick: false
          // clusterLayout: [
          //   "<ul class=list>",
          //   "{% for geoObject in properties.geoObjects %}",
          //   '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
          //   "{% endfor %}",
          //   "</ul>"
          // ].join("")
        }
      }
    };
  },
  computed: {
    playcategories() {
      return this.$store.state.playcategories;
    },
    searchResults() {
      return this.$store.state.searchResults;
    },
    mapCenter() {
      let mapCoords = this.searchResults.map(item => {
        return { x: item.location.latitude, y: item.location.longitude };
      });

      let max = { x: 0, y: 0 };
      let min = { x: 9999999, y: 9999999 };

      mapCoords.forEach(item => {
        if (item.x > max.x) max.x = item.x;
        if (item.y > max.y) max.y = item.y;

        if (item.x < min.x) min.x = item.x;
        if (item.y < min.y) min.y = item.y;
      });

      let center = [
        parseFloat(min.x) + parseFloat((max.x - min.x) / 2),
        parseFloat(min.y) + parseFloat((max.y - min.y) / 2)
      ];

      return center;
    },

    page() {
      return this.$store.state.pages.search;
    }
  },
  watch: {
    async $route(newVal) {
      await this.applySearch(newVal);
    }
  },
  methods: {
    balloon(item) {
      return `
        <div 
          style="
            width: 100%; 
            font-size: 14px; 
            display: flex; 
            justify-content: space-between;
            background-color: #ffffff;
            color: #064482;
            padding-bottom: 1.25em;"
        >
          <div 
            style="
              background-image: url('${
                item.images.length > 0 ? item.images[0].image : null
              }');
              width: 40%;
              max-width: 40%;
              height: 10em;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;"
          ></div>
          
          <div 
            style="
              width: 55%;
              max-width: 55%;
              display: flex;
              flex-direction: column;
              position: relative;"
          >
            <span style="font-size: 1.5em">${item.name}</span>
            <span style="font-size: 1.2em">от ${item.cost * 2} тг/ч</span>
            <span>Адрес - ${item.location.address}</span>
            <span>Тип - ${item.type}</span>
            <span>Размеры - ${Math.round(item.length)}х${Math.round(
        item.width
      )} м</span>
            <a 
              href="/playground/${item.id}" 
              style="position: absolute; right: 0; bottom: -1.25em;"
            >Подробнее</a>
          </div>
        </div>`;
    },

    search() {
      let query = "?";
      for (let key in this.filter) {
        if (this.filter[key]) {
          query += `${key}=${this.filter[key]}&`;
        }
      }

      this.$router.push("/search/1" + query);
    },

    clearSearch() {
      this.$router.push("/search/1");
    },

    async applySearch(route) {
      this.loading = true;

      for (let key in this.filter) {
        if (key.includes("is")) {
          this.filter[key] = false;
        } else {
          this.filter[key] = null;
        }
      }

      let { query } = route;
      for (let key in query) {
        this.filter[key] = query[key];
      }

      this.$store.commit("setSearchQuery", query);
      await this.$store.dispatch("getSearchResults");

      window.scrollTo({
        top: this.filter.category ? 650 : 400,
        behavior: "smooth"
      });
      this.loading = false;
    }
  },

  async mounted() {
    await this.applySearch(this.$route);
  }
};
</script>
<style scoped>
.search_main {
  width: 100%;

  font-size: 14px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 1em 3em;
}

.search_main > .result {
  width: 100%;

  display: flex;
  justify-content: space-between;

  margin-top: 3em;
}

.result > .total {
  width: 60%;
  max-width: 60%;

  padding: 3em 2em;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;

  margin-bottom: 3rem;
}

.result > .map {
  height: 50em;
}

.total > .pagination {
  font-size: 1.2rem;

  position: absolute;
  bottom: -1em;

  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #064482;
}

.pagination > .pages {
  padding: 0 1em;
  background-color: white;

  display: flex;
}

.pages > div {
  padding: 0.2em 0.8em;
  border: solid 1px #e8e7e7;

  margin-left: -1px;

  cursor: pointer;
}

.pages > div:hover {
  background-color: rgba(0, 0, 0, 0.16);
}

.pages > .active {
  background-color: #d6ecfb;
}

.total > .title {
  position: absolute;

  padding: 0 2em;

  background-color: white;

  top: -1.5em;
  left: 2em;
}

.title > button {
  font-size: 16px;

  padding: 0.75em 2em;

  border: solid 2px #064482;
  background-color: #ffffff;
  border-radius: 4px;

  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.73;
  letter-spacing: normal;
  text-align: center;
  color: #064482;
}

.title > button.active {
  background-color: #064482;
  color: #ffffff;
}

.pole_block {
  width: 100%;

  font-size: 14px;

  padding: 1em;

  margin-bottom: 2em;

  display: flex;
  justify-content: space-between;

  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;

  color: #064482;
}

.pole_block > .img {
  width: 40%;
  max-width: 40%;

  height: auto;

  background-image: url("/img/logo.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.pole_block > .content {
  width: 55%;
  max-width: 55%;

  display: flex;
  flex-direction: column;

  position: relative;
}

.content > a {
  position: absolute;
  right: 0;
  bottom: 0;
}

.search_main > .logo {
  height: 2em;
  width: 100%;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  border-radius: 39px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

  font-size: 6em;

  padding: 0 0.5em;

  display: flex;
  align-items: center;

  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  /* font-family: "Century Gothic"; */
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #ffffff;

  margin: 0.1em 0;

  transition: 0.5s;
}

.search_main > .filter {
  font-size: 2em;

  margin: 1em 0;
  padding: 1em;

  min-height: 1em;
  width: 80%;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;

  display: flex;
  justify-content: space-between;
}

.filter > .title {
  position: absolute;

  top: -0.7em;
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

.filter > .block {
  width: 49%;
  max-width: 49%;

  display: block;

  font-size: 12px;

  position: relative;

  /* font-family: "Century Gothic"; */
  color: #064482;
}

.block > select {
  width: 45%;

  float: left;

  margin-right: 4%;
  margin-bottom: 2em;

  border: solid 1px #064482;
  color: #064482;
}

.block > .time {
  width: 45%;
  float: left;

  margin-right: 4%;
  margin-bottom: 2em;

  color: #064482;

  position: relative;
}

.time > span {
  width: 100%;

  display: flex;
  align-items: center;
}

.time > span > input {
  max-width: 38%;
  width: 100%;

  margin: 0 0.5em;
}

.block > .checkbox {
  font-size: 1.3em;

  float: left;

  margin-right: 1.5em;
  margin-bottom: 2.5em;

  width: 8em;
}

.block > .title {
  position: absolute;
  top: -1.75em;
}

.block > a {
  position: absolute;
  bottom: 0;
  left: 0;
}

.filter > button {
  font-size: 16px;

  position: absolute;

  bottom: -1em;
  left: 40%;

  padding: 0.75em 3em;

  background-color: #064482;
  color: white;

  border-style: none;

  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.73;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;

  border-radius: 2px;
}

.filter > button:active {
  bottom: -1.2em;
}

@media (max-width: 767px) {
  * {
    border-radius: 0 !important;
  }

  .search_main {
    padding: 0;
  }

  .search_main > .logo {
    margin: 0;
  }

  .search_main > .filter {
    flex-direction: column;
    padding-bottom: 2em;
  }

  .filter > .block {
    width: 100%;
    max-width: 100%;

    margin: 1em 0;
  }

  .filter > button {
    left: 15%;
  }

  .block > select {
    width: 100%;
    margin: 0;
    margin-bottom: 1em;
  }

  .block > .checkbox {
    margin: 0;
    margin-bottom: 0.5em;
  }

  .block > a {
    bottom: -2em;
    left: 0;
    right: 0;
  }

  .result > .total {
    width: 100%;
    max-width: 100%;

    padding: 3em 0;
  }

  .search_main > .logo {
    font-size: 3em;
  }

  .search_main > .filter {
    width: 100%;
  }

  .block > .time {
    width: 100%;
    float: none;

    margin: 0;
    margin-bottom: 1em;
  }

  .time > span {
    width: 100%;
  }

  .pole_block {
    padding: 0;
    padding-bottom: 3em;
  }

  .content > a {
    bottom: -3em;
    padding: 0.8em;

    width: 182%;

    text-align: center;

    background-color: #064482;
    color: white;
  }
}
</style>
