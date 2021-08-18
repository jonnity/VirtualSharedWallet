import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  icons: {
    iconfont: "mdi",
  },
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
