<template>
  <div class="news_main">
    <div class="main">
      <div class="title">Новости</div>
      <h1>{{ data.title }}</h1>
      <b-carousel controls background="#ababab" indicators class="carousel" img-height="100%">
        <b-carousel-slide
          :img-src="item.image"
          v-for="(item, index) in data.images"
          :key="'carImage' + index"
        ></b-carousel-slide>
      </b-carousel>
      <div class="text">{{ data.content }}</div>
    </div>
  </div>
</template>
<script>
export default {
  async fetch({ store, params }) {
    try {
      await store.dispatch("getSingle_new", params.id);
    } catch (error) {
      return { error };
    }
  },

  computed: {
    data() {
      return this.$store.state.single_new;
    }
  }
};
</script>

<style>
.news_main {
  width: 100%;

  font-size: 14px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 1em 2em;

  position: relative;
  color: #064482;
}

.news_main > .main {
  font-size: 2em;

  margin: 1em 0;
  padding: 1em 2em;

  min-height: 1em;
  width: 100%;

  border-radius: 36px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 1px #064482;

  position: relative;
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

.main > .carousel {
  height: 18em;

  margin-top: 1em;

  border: solid 1px #064482;
  border-radius: 20px;

  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
}

.main > .text {
  font-size: 0.75em;
  text-align: justify;
  white-space: pre-wrap;

  margin-top: 1em;
}

@media (max-width: 767px) {
  .news_main {
    padding: 1em 0;
  }

  .news_main > .main {
    padding: 1em 0;
  }

  .main > h1 {
    padding: 0 0.25em;
  }

  .main > .carousel {
    height: 13em;
  }

  .main > .text {
    padding: 0 0.5em;
  }
}
</style>
