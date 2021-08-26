<template>
  <div class="modal_overlay">
    <v-card class="modal_contents" color="white" v-click-outside="closeModal">
      <v-container>
        <v-row justify="end">
          <v-btn @click="closeModal" icon>
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <p>{{ shareLink }}</p>
          <textCopyButton :text="shareLink"></textCopyButton>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import textCopyButton from "./textCopyButton.vue";
export default {
  name: "shareLinkModal",
  components: {
    textCopyButton,
  },
  data() {
    return {};
  },
  props: ["shareLink"],
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style></style>
