import Vue from "vue";
import YmapPlugin from "vue-yandex-maps";

const YMsettings = {
  apiKey: "83d55aae-688d-42b3-951c-dd20f3171220",
  lang: "ru_RU",
  coordorder: "latlong",
  version: "2.1"
};

Vue.use(YmapPlugin, YMsettings);
