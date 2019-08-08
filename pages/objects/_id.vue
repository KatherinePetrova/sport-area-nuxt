<template>
  <div class="object-main" ref="object-main">
    <div class="title" :style="{backgroundImage: `url(${playcategory.photo})`}">{{ data.name }}</div>
    <div class="content">
      <div class="data filter">
        <div class="title">Фильтр</div>
        <b-form-input placeholder="Поиск" v-model="filter.search"></b-form-input>
        <label style="margin: 0">Период</label>
        <div class="date">
          <no-ssr>
            <date-picker
              v-model="filter.date.from"
              :language="filter.date.language"
              class="datepicker"
              :bootstrap-styling="true"
            ></date-picker>

            <date-picker
              v-model="filter.date.to"
              :language="filter.date.language"
              class="datepicker"
              :bootstrap-styling="true"
            ></date-picker>
          </no-ssr>
        </div>

        <label style="margin: 0">Тип бронирования</label>
        <b-form-select v-model="filter.type">
          <option :value="null">Все</option>
          <option :value="true">Вручную</option>
          <option :value="false">Онлайн</option>
        </b-form-select>

        <label style="margin: 0">Сортировать по дате</label>
        <b-form-select v-model="filter.sort">
          <option :value="-1">Сначала новые</option>
          <option :value="1">Сначала старые</option>
        </b-form-select>
      </div>
      <div class="data" ref="data">
        <div class="title">Информация о бронировании</div>
        <div class="info">{{ `Общее количество броней за период: ${numbers.counts}` }}</div>
        <div class="info">{{ `Прибыль за период: ${numbers.income}` }}</div>
        <div class="info">{{ `Общее количество часов броней за период: ${numbers.hours}` }}</div>
        <div class="pred-table" ref="pred-table">
          <div class="table">
            <div class="table-row">
              <div class="table-cell">Имя</div>
              <div class="table-cell">Телефон</div>
              <div class="table-cell">Время</div>
              <div class="table-cell">Статус</div>
            </div>
          </div>

          <label style="text-align: center; width: 100%;" v-if="table.length == 0">Ничего не найдено</label>

          <transition-group name="page">
            <div class="table" v-for="(item, index) in table" :key="'table' + index">
              <div
                class="date"
              >{{ `${item.date.getDate()} ${months[item.date.getMonth()]} ${item.date.getFullYear()}` }}</div>
              <div
                class="table-row table-hover"
                v-for="(el, ind) in item.items"
                :key="'table-row' + index + ind"
              >
                <div
                  class="table-cell"
                  v-for="(obj, objInd) in el"
                  :key="'table-cell' + index + ind + objInd"
                >{{ obj }}</div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ru } from "vuejs-datepicker/dist/locale";

export default {
  async asyncData({ store, params, redirect }) {
    await store.dispatch("getPlaycategories");
    await store.dispatch("getPlayground", params.id);

    let data = JSON.parse(JSON.stringify(store.state.playground));

    if (store.state.user.id != data.owner) {
      redirect("/cabinet");
    }

    let playcategory = store.state.playcategories.find(
      item => item.id == data.category
    );
    let booking_data = await store.dispatch("getPlaygroundBooking", params.id);
    let months = ru.months;

    return {
      data,
      booking_data,
      playcategory,
      filter: {
        date: {
          from: new Date(0),
          to: new Date(),
          language: ru
        },
        search: "",
        type: null,
        sort: -1
      },
      months
    };
  },
  computed: {
    table() {
      let bookings = JSON.parse(JSON.stringify(this.booking_data.bookings));
      let result = [];
      bookings.forEach(item => {
        let finded = result.find(el => el.compare == item.date);
        if (!finded) {
          result.push({ date: new Date(item.date), compare: item.date });
        }
      });

      result.forEach(item => {
        item.add_inf = [];
        item.add_inf = bookings.filter(
          el =>
            el.date == item.compare &&
            el.user_info.name
              .toLowerCase()
              .includes(this.filter.search.toLowerCase()) &&
            new Date(el.date).getTime() >= this.filter.date.from.getTime() &&
            new Date(el.date).getTime() <= this.filter.date.to.getTime()
        );

        if (typeof this.filter.type != "object") {
          item.add_inf = item.add_inf.filter(
            el => el.is_owner == this.filter.type
          );
        }

        item.items = [];

        for (let i = 0; i < item.add_inf.length; i++) {
          item.items.push({
            Имя: item.add_inf[i].user_info.name,
            Телефон: item.add_inf[i].user_info.phone,
            Время: item.add_inf[i].time_range,
            Статус: item.add_inf[i].is_paid ? "Оплачено" : "Ожидается оплата"
          });
        }
      });

      result.sort((a, b) => {
        if (a.date.getTime() > b.date.getTime()) {
          return this.filter.sort;
        }
      });

      for (let i = 0; i < result.length; i++) {
        if (result[i].add_inf.length == 0) {
          result.splice(i, 1);
          i--;
        }
      }

      return result;
    },

    numbers() {
      let hours = { hours: 0, minutes: 0 };
      let income = 0;
      let counts = 0;

      let table = this.table;
      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].add_inf.length; j++) {
          income += Math.round(table[i].add_inf[j].total_cost);
          counts++;

          let { time_range } = table[i].add_inf[j];
          time_range = time_range.split(" - ");

          hours.hours +=
            time_range[1].split(":")[0] - time_range[0].split(":")[0];
          hours.minutes +=
            time_range[1].split(":")[1] - time_range[0].split(":")[1];
        }
      }

      hours = hours.hours + hours.minutes / 60;

      return { hours, income, counts };
    }
  }
};
</script>

<style scoped>
.content > .data {
  width: 60%;

  padding: 2em;

  border: solid 1px #064482;
  border-radius: 1em;

  position: relative;
  height: 1%;
}

.data > .pred-table {
  height: 1%;
  transition: 1s;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.table {
  margin: 0;
}

.table > .table-row {
  display: flex;

  cursor: default;
}

.table > .table-hover:hover {
  background-color: rgb(230, 230, 230);
}

.table > .date {
  padding: 0.5em 1em;

  background-color: #064482;
  color: white;
}

.table-row > .table-cell {
  display: flex;
  justify-content: center;
  text-align: center;

  width: 100%;
  min-width: 25%;

  padding: 0.5em 0;
  overflow: hidden;

  text-overflow: ellipsis;
  color: #064482;
}

.data > .info {
  font-size: 1.2em;
  cursor: default;
}

.data > .date {
  display: flex;
  justify-content: space-between;
}

.date > div {
  width: 48%;
}

.data > * {
  color: #064482;
  margin-bottom: 1em;
}

.data > .title {
  position: absolute;

  font-size: 1.5em;
  color: #064482;
  font-weight: 600;

  padding: 0 1em;

  top: -1em;

  background-color: white;

  margin: 0;
}

.content > .filter {
  width: 35%;
}

.object-main > .content {
  display: flex;
  justify-content: space-between;
}

.object-main > .title {
  color: white;
  font-size: 3em;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  font-weight: 600;

  padding: 1em;

  border-radius: 0.5em;

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.object-main > * {
  margin-bottom: 1em;
}

.object-main {
  display: flex;
  flex-direction: column;

  font-size: 1rem;

  padding: 2em;
}

@media (max-width: 767px) {
  .object-main {
    padding: 0;
  }

  .object-main > .content {
    flex-direction: column;
  }

  .content > .data {
    width: 100% !important;

    padding: 0;
    padding-top: 5em;
  }

  .content > .filter {
    padding: 2em;
  }

  .data > .info {
    margin-left: 1em;
  }
}
</style>