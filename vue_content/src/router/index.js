import Vue from "vue";
import VueRouter from "vue-router";
import appendUserForm from "../routingContents/appendUserForm.vue";
import repaymentForm from "../routingContents/repaymentForm.vue";
import shareAndLoadForm from "../routingContents/shareAndLoadForm.vue";

import tippingForm from "../routingContents/tippingForm.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "appendUserForm",
    component: appendUserForm,
  },
  {
    path: "/repaymentForm",
    name: "repaymentForm",
    component: repaymentForm,
  },
  {
    path: "/shareAndLoadForm",
    name: "shareAndLoadForm",
    component: shareAndLoadForm,
  },
  {
    path: "/tippingForm",
    name: "tippingForm",
    component: tippingForm,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
