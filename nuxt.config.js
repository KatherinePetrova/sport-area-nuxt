const YMsettings = {
  apiKey: "66a3bf5f-3f83-4f27-8bf2-60d57f6e3136",
  lang: "ru_RU",
  coordorder: "latlong",
  version: "2.1"
};

module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  server: {
    port: 8001, // default: 3000
    host: "0.0.0.0" // default: localhost
  },
  env: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000"
  },
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: "components/loading.vue",
  /*
   ** Global CSS
   */
  css: ["~/assets/index.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: "~plugins/vue-slick.js", ssr: false }],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    "bootstrap-vue/nuxt",
    ["vue-yandex-maps/nuxt", YMsettings]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
