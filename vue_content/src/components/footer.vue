<template>
  <v-footer color="#666" absolute padless v-resize="onResize" ref="footer">
    <v-container>
      <v-row>
        <v-col cols="4"></v-col>
        <v-col cols="4" class="footer_centering">
          <strong class="white--text">wa-warikan</strong>
        </v-col>
        <!-- <v-spacer></v-spacer> -->
        <v-col cols="4" class="footer_centering">
          <v-btn v-for="icon in icons" :key="icon" class="mx-1" icon dark>
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data: function() {
    return {
      icons: ["mdi-home", "mdi-email", "mdi-calendar"],
    };
  },
  computed: {},
  methods: {
    onResize: function() {
      const footer_height = this.$el.getBoundingClientRect().height;
      this.$emit("resizeEvent", footer_height);
    },
  },
};
</script>

<style scoped>
.footer_centering {
  align-self: center;
  text-align: center;
}
</style>
