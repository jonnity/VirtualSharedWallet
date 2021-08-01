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

<style>
.modal_overlay {
  /*要素を重ねた時の順番*/
  z-index: 1;

  /*画面全体を覆う設定*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  /*画面の中央に要素を表示させる設定*/
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal_contents {
  z-index: 2;
  width: 50%;
  padding: 1em;
  background: #fff;
}
</style>
