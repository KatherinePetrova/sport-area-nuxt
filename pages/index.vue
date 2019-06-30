<template>
  <div>
    <section>
      <div class="container">
        <div class="col-lg-12 mt-5 box-1" :style="{ border: '1px solid #064482' }">
          <h1 class="font-weight-light">
            <span>ВЫБЕРИТЕ ВИД СПОРТА</span>
          </h1>

          <a
            href
            data-toggle="modal"
            data-target="#soccerModal"
            v-for="(item, index) in sports"
            :key="index+'sport'"
            @click.prevent="expandSport(index)"
          >
            <div
              :ref="'sport' + index"
              :style="{ 
                backgroundImage: `url(${item.img})`,
                marginBottom: item.show ? '5rem!important' : '1rem!important'
              }"
              class="col-lg-12 box text-white my-2 py-4 text-center expandSport"
            >
              <div class="card-body">
                <h1 class="font-weight-bold float-left">{{ item.name.toUpperCase() }}</h1>
              </div>
              <transition name="shade">
                <modal-component-two v-show="item.show" :data="playgrounds(item.id)" />
              </transition>
            </div>
          </a>
        </div>
      </div>
    </section>
    <section>
      <div class="container mb-5">
        <div class="col-lg-12 mt-5 box-2" :style="{ border: '1px solid #064482' }">
          <h1 class="font-weight-light">
            <span>НОВОСТИ</span>
          </h1>
        </div>
      </div>
    </section>
    <section>
      <div class="container mb-5">
        <div class="col-lg-12 mt-5 box-2" :style="{ border: '1px solid #064482' }">
          <h1 class="font-weight-light">
            <span>Приложение SportArea.kz</span>
          </h1>
          <div class="row">
            <div class="col-lg-6">
              <h4 class="font-weight-light">
                Теперь у вас есть возможность быстро, легко и удобно забронировать спортивные
                площадки
              </h4>
              <ul>
                <li>— Поиск по базе спортивных площадок Казахстана</li>
                <li>— Возможность забронировать спортивные площадки в несколько нажатий</li>
                <li>— Личный кабинет для редактирования и оплаты бронирования</li>
                <li>— Добавление фото и видео с помощью камеры</li>
                <li>— Возможность подать объявления бесплатно</li>
                <li>— Свежие новости и статьи по спортивной тематике</li>
              </ul>
            </div>
            <div class="col-lg-6 d-flex justify-content-around" id="phone_block">
              <img id="phone" alt="phone img" src="/phone.png" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ModalComponent from "~/components/modal.vue";
import ModalComponentTwo from "~/components/modal2.vue";

export default {
  components: { ModalComponent, ModalComponentTwo },
  async fetch({ store }) {
    await store.dispatch("getPlaycategories");
    await store.dispatch("getPlaygrounds");
  },
  computed: {
    playcategories() {
      return this.$store.state.playcategories;
    }
  },
  data() {
    return {
      sports: [
        { name: "Футбол", img: "img/soccer.png", show: false, id: 1 },
        { name: "Баскетбол", img: "img/basketball.png", show: false, id: 2 },
        { name: "Теннис", img: "img/tennis.jpg", show: false, id: 3 },
        { name: "Пинг-понг", img: "img/ping_pong.png", show: false, id: 4 },
        { name: "Волейбол", img: "img/volleyball.png", show: false, id: 5 }
      ]
    };
  },

  methods: {
    expandSport(index) {
      for (let i = 0; i < this.sports.length; i++) {
        if (i == index && !this.sports[i].show) {
          this.$refs["sport" + i][0].style.height = "30em";
          this.$refs["sport" + i][0].style.marginBottom = "5rem!important";
          this.sports[i].show = true;
        } else {
          this.$refs["sport" + i][0].style.height = "8em";
          this.$refs["sport" + i][0].style.marginBottom = "1rem!important";
          this.sports[i].show = false;
        }
      }
    },
    playgrounds(id) {
      let result = this.$store.state.playgrounds.filter(
        item => item.category == id
      );
      if (result.length > 4) result = result.slice(0, 4);

      return result;
    }
  }
};
</script>

<style lang="scss">
.shade-enter-active,
.shade-leave-active {
  transition: opacity 0.5s;
}
.shade-enter,
.shade-leave-to {
  opacity: 0;
}

.expandSport {
  transition: 1s;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  margin-bottom: 1rem !important;
}

.slick-slide {
  outline: none;
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .slick-slide {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
}

.slick-prev:before,
.slick-next:before {
  font-size: 30px;
  color: #064482;
}

.slick-prev {
  left: -40px;
}
[dir="rtl"] .slick-prev {
  right: -40px;
  left: auto;
}

.slick-next {
  right: -40px;
}
[dir="rtl"] .slick-next {
  right: auto;
  left: -40px;
}

.slick-prev:hover,
.slick-prev:focus,
.slick-next:hover,
.slick-next:focus {
  background-color: white;
}

.slick-prev,
.slick-next {
  width: 30px;
  height: 30px;
  cursor: pointer;

  color: grey;
  background-color: white;
}
</style>
