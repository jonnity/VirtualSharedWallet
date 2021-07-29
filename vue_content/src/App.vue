<template>
  <v-app>
    <userRoot></userRoot>
  </v-app>
</template>

<script>
import userRoot from "./components/userRoot.vue"

export default {
  name: "App",
  components: {
    userRoot,
  },
  data: () => ({
    //
  }),
};
</script>
