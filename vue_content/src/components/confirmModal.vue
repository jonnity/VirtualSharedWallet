<template>
  <div class="modal_overlay">
    <v-card class="modal_contents" color="white" v-click-outside="cancel">
      <v-container>
        <v-row justify="center">
          <p>
            {{ confirmContents }}
          </p>
        </v-row>
        <v-row justify="center">
          <v-btn @click="cancel">
            キャンセル
          </v-btn>
          <v-btn @click="confirm">
            実行
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "confirmModal",
  props: ["confirmContents"],
  data() {
    return {};
  },
  methods: {
    confirm: function() {
      this.$emit("confirmEvent");
    },
    cancel: function() {
      this.$emit("cancelEvent");
    },
  },
};
</script>

<style></style>
