<template>
  <v-app>
    <users id="id_component_users"></users>
  </v-app>
</template>

<script>
import users from "./components/users.vue"

export default {
  name: 'App',
  components: {
    users
  },
  data: () => ({
    //
  }),
};
</script>
