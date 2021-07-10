<template>
  <v-app>
    <users></users>
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
