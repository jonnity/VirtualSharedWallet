<template>
  <v-app>
    <userRoot></userRoot>
    <div :style="padding_styles"></div>
    <myFooter @resizeEvent="footerPadding"></myFooter>
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
  data: function() {
    return {
      padding_styles: "",
    };
  },
  methods: {
    footerPadding: function(footer_size) {
      this.padding_styles = {
        "padding-top": footer_size + "px",
      };
    },
  },
};
</script>

<style scoped></style>
