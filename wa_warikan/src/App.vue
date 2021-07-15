<template>
  <v-app>
    <appBar></appBar>
    <div class="ma-8"></div>
    <users id="id_component_users"></users>
  </v-app>
</template>

<script>
import users from "./components/users.vue"
import appBar from "./components/appBar.vue"

export default {
  name: "App",
  components: {
    users,
    appBar,
  },
  data: () => ({
    //
  }),
};
</script>
