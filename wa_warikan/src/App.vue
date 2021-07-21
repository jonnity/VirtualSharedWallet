<template>
  <v-app>
    <appBar></appBar>
    <div class="ma-8"></div>
    <userRoot></userRoot>
  </v-app>
</template>

<script>
import userRoot from "./components/userRoot.vue"
import appBar from "./components/appBar.vue"

export default {
  name: "App",
  components: {
    userRoot,
    appBar,
  },
  data: () => ({
    //
  }),
};
</script>
