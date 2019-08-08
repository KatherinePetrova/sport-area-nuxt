<template>
  <div>
    <section>
      <div class="container">
        <div class="col-lg-12 mt-5 box-1" :style="{ border: '1px solid #064482' }">
          <h1 class="font-weight-light">
            <span class="title">ВЫБЕРИТЕ ВИД СПОРТА</span>
          </h1>

          <div
            v-for="(item, index) in sports"
            :key="index+'sport'"
            @click.prevent="expandSport(index)"
          >
            <div
              :ref="'sport' + index"
              :style="{ 
                backgroundImage: `url(${item.photo})`,
                
                cursor: item.show ? 'default' : 'pointer'
              }"
              class="col-lg-12 box text-white my-2 py-4 text-center expandSport"
            >
              <div class="card-body">
                <h1 class="font-weight-bold float-left">{{ item.name.toUpperCase() }}</h1>
              </div>
              <transition name="shade">
                <modal-component-two
                  v-show="item.show"
                  :data="item.playgrounds"
                  :category_id="item.id"
                  :total="item.total"
                />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container mb-5">
        <div
          class="col-lg-12 mt-5 box-2"
          :style="{ border: '1px solid #064482', marginBottom: '5em' }"
        >
          <h1 class="font-weight-light">
            <span>НОВОСТИ</span>
          </h1>
          <div style="overflow: hidden; height: 100%; width: 100%; position: relative">
            <vue-slick
              :options="{
                slidesToShow: slides, 
                slidesToScroll: slides, 
                dots: true,
                infinite: false,
                speed: 300,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows: false
              }"
            >
              <div
                class="text-center mt-2"
                v-for="(item, index) in news"
                :key="index+'new'"
                style="cursor: pointer"
                @click="$router.push(`/news/${item.id}`)"
              >
                <div
                  class="news fdb-box"
                  style="overflow: hidden; background-size: cover; background-position: center"
                  :style="{backgroundImage: item.images.length > 0 ? `url(${item.images[0].image})` : 'url(/img/news.png)'}"
                >
                  {{ item.title }}
                  <div class="lead" style="overflow: hidden; max-height: 3em">{{ item.content }}</div>
                </div>
              </div>
            </vue-slick>
          </div>
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

import slickSettings from "~/service/slickSettings.js";

import api from "~/service/api.js";

export default {
  components: { ModalComponent, ModalComponentTwo },
  async asyncData({ store }) {
    await store.dispatch("getPlaycategories");
    await store.dispatch("getNews");

    let sports = JSON.parse(JSON.stringify(store.state.playcategories));
    for (let i = 0; i < sports.length; i++) {
      sports[i].show = false;

      let response = await api().get(`playgrounds/?category=${sports[i].id}`);
      let { data } = response;

      sports[i].total = data.count;
      sports[i].playgrounds = data.results.slice(0, 4);
    }

    return { sports };
  },
  computed: {
    news() {
      return this.$store.state.news;
    },

    slides() {
      try {
        let offsetWidth = document.documentElement.offsetWidth;

        if (offsetWidth >= 768) {
          return 3;
        } else {
          return 1;
        }
      } catch (error) {
        return 2;
      }
    }
  },
  data() {
    return { slickSettings };
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
  background-position: center;

  position: relative;

  margin-bottom: 1rem !important;
}

.slick-track {
  display: flex;
  overflow: hidden;

  width: 100%;
}

.slick-slide {
  margin-right: 1em;
}

.slick-dots {
  display: flex;
  justify-content: center;

  margin: 0;
  padding: 0;

  margin-top: 0.5em;

  height: 0.5rem;
}

.slick-dots > li {
  background-color: white;
  border: solid 1px #064482;
  border-radius: 50% !important;

  width: 0.5rem;
  margin-right: 0.5em;
}

.slick-dots > li.slick-active {
  background-color: #064482;
}

.slick-dots > li > button {
  opacity: 0;
}

@media (max-width: 768px) {
  * {
    border-radius: 0 !important;
  }

  span.title {
    padding: 0 !important;
  }

  .container {
    padding: 0;
  }

  .box-1 {
    padding: 0 !important;
  }

  .expandSport {
    border-radius: 0 !important;
    padding: 0;
  }
}
</style>
