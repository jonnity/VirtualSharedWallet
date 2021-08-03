<template>
  <div class="modal_overlay">
    <v-card class="modal_contents" color="white" v-click-outside="closeHelp">
      <v-container>
        <v-row justify="end">
          <v-btn @click="closeHelp" icon>
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center">
          <helpCarousel></helpCarousel>
          <!-- <h2>概要</h2>
          <p>
            「みんなで合計xxx円」という支払いを誰かがまとめて払っても、最終的に割り勘できたら完璧
          </p>
          <p>ちょっとメモするだけで実現可能</p> -->
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import helpCarousel from "./helpCarousel.vue";
export default {
  name: "helpModal",
  components: {
    helpCarousel,
  },
  data() {
    return {};
  },
  props: [""],
  methods: {
    closeHelp: function() {
      this.$emit("closeHelp");
    },
  },
};
</script>

<style></style>
