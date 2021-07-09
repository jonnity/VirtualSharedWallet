<template>
  <v-app>
    <user-info></user-info>
    <user-info></user-info>
  </v-app>
</template>

<script>
import userInfo from './components/userInfo.vue';

export default {
  name: 'App',
  components: {
    userInfo,
  },

  data: () => ({
    //
  }),
};
</script>
