<template>
  <div class="add-id-main">
    <div class="title" :style="{backgroundImage: `url(${photo})`}">
      <label>{{ playground.name }}</label>
    </div>
    <div class="change">
      <div class="title">Редактирование</div>
      <div class="save">
        <b-button @click="save">Сохранить</b-button>
      </div>
      <div class="days">
        <div
          :class="{active: selected == index}"
          v-for="(item, index) in change.weekDays"
          :key="index + 'day' +index"
          @click="selected = index"
        >{{ item }}</div>
      </div>
      <div class="open">
        <div @click="change.data[selected].is_closed = !change.data[selected].is_closed">
          <div class="toggle" :class="{'toggle-2': !change.data[selected].is_closed}"></div>
        </div>
        <label>{{ !change.data[selected].is_closed ? 'открыто' : 'закрыто' }}</label>
      </div>
      <label style="color: #064482">Время и цена</label>
      <div class="times">
        <div
          class="time"
          v-for="(item, index) in change.data[selected].windows"
          :key="'times' + selected + index"
        >
          <b-form-input
            :value="`${item.from_time} - ${item.to_time}`"
            disabled
            style="margin-right: 1em"
          ></b-form-input>
          <b-form-input v-model="change.data[selected].windows[index].price" type="number"></b-form-input>
        </div>
        <div class="cover" v-if="change.data[selected].is_closed"></div>
      </div>
    </div>
    <div class="change list">
      <label
        v-if="table.length == 0"
        style="color: #064482"
      >Вашу площадку еще никто не бронировал : ^)</label>
      <div class="title">Список</div>
      <div class="table" v-for="(item, index) in table" :key="'tableslot' + index">
        <div>{{ item.date }}</div>
        <b-table hover :items="item.dates"></b-table>
      </div>
    </div>
  </div>
</template>
<script>
let weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export default {
  methods: {
    save() {
      this.$store.commit("setSuccess", {
        show: true,
        message: "Изменения сохранены успешно"
      });
    }
  },
  async asyncData({ store, redirect, params }) {
    await store.dispatch("getPlayground", params.id);
    let playground = JSON.parse(JSON.stringify(store.state.playground));

    let category = await store.dispatch("getPlaycategories");
    category = category.find(item => item.id == playground.category);

    if (!store.state.user.id || playground.owner != store.state.user.id) {
      redirect("/");
    }

    let data = [];
    weekDays.forEach((item, index) => {
      data.push(playground.days[index]);
    });

    let days = playground.days;
    let table = [];

    for (let i = 0; i < days.length; i++) {
      let dates = [];
      for (let j = 0; j < days[i].windows.length; j++) {
        if (days[i].windows[j].is_booked) {
          let window = {
            Имя: days[i].windows[j].booked_user_info.name,
            Телефон: days[i].windows[j].booked_user_info.phone,
            Время: `${days[i].windows[j].from_time}-${days[i].windows[j].to_time}`,
            Статус: days[i].windows[j].is_paid ? "Оплачено" : "Ожидается оплата"
          };
          dates.push(window);
        }
      }

      if (dates.length > 0) {
        table.push({ date: days[i].date, dates });
      }
    }

    return {
      selected: 0,
      change: { weekDays, closed: false, data },
      table,
      playground,
      photo: category.photo
    };
  }
};
</script>
<style scoped>
.add-id-main {
  display: flex;
  justify-content: space-between;

  padding: 1em 4em;
  margin-top: 13rem;

  position: relative;
}

.add-id-main > .title {
  position: absolute;

  top: -12em;

  padding: 3.5em;

  border-radius: 1.5em;

  width: calc(100% - 8em);

  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  color: white;

  background-size: cover;
  background-position: center;
}

.title > label {
  font-size: 3em;
}

.add-id-main > .change {
  display: flex;
  flex-direction: column;

  border: solid 1px #064482;
  border-radius: 2em;

  padding: 2em;

  width: 48%;

  position: relative;

  margin: 2em 0;

  min-height: 1%;
  height: 1%;
}

.change > .title {
  position: absolute;

  padding: 0.5em 1em;

  background-color: white;
  color: #064482;

  font-size: 1.5rem;

  top: -1.5em;
  left: 3em;
}

.change > * {
  margin-bottom: 1rem;
}

.change > .table {
  overflow: auto;
  margin: 0;
}

.table > div {
  background-color: #064482;
  color: white;

  padding: 1em;
  position: sticky;

  left: 0;

  width: 100%;
}

.change > .save {
  position: absolute;

  padding: 0 2em;

  background-color: white;

  bottom: -2em;
  left: 10em;
}

.save > button {
  background-color: #064482;

  padding: 0.5em 4em;

  border: none;
}

.save > button:hover {
  background-color: #5e9edf;
}

.change > .times {
  display: flex;
  flex-direction: column;

  position: relative;
}

.times > .time {
  display: flex;
  margin-bottom: 1em;
}

.times > .cover {
  background-color: rgba(255, 255, 255, 0.7);

  position: absolute;

  height: 100%;
  width: 100%;

  z-index: 1;
}

.open {
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

.days {
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

@media (max-width: 767px) {
  .add-id-main {
    padding: 1em 0;
    flex-direction: column;

    margin-top: 10rem;
  }

  .add-id-main > .title {
    top: -10rem;
    width: 100%;
  }

  .title > label {
    font-size: 1.5rem;
  }

  .add-id-main > .change {
    width: 100%;

    margin-top: 6em;

    padding: 2em 1em;
  }

  .add-id-main > .list {
    padding: 2em 0;

    margin-top: 2em;
  }

  .change > .save {
    left: 3em;
  }
}
</style>
