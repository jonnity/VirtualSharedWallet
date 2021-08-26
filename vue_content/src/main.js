import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueCookies from "vue-cookies";

import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueCookies);

new Vue({
  icons: {
    iconfont: "mdi",
  },
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
