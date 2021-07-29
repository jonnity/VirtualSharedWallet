<template>
  <v-app>
    <userRoot></userRoot>
    <myFooter></myFooter>
  </v-app>
</template>

<script>
import userRoot from "./components/userRoot.vue";
import myFooter from "./components/footer.vue";

export default {
  name: "App",
  components: {
    userRoot,
    myFooter,
  },
  data: () => ({
    //
  }),
};
</script>
