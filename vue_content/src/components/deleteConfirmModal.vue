<template>
  <div class="modal_overlay">
    <v-card
      class="modal_contents"
      color="white"
      v-click-outside="cancelDeleting"
    >
      <v-container>
        <v-row justify="center">
          <p>{{ deletedUserName }} さんを削除します。</p>
        </v-row>
        <v-row justify="center">
          <v-btn @click="cancelDeleting">
            キャンセル
          </v-btn>
          <v-btn @click="confirmDeleting">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "deleteConfirmModal",
  data() {
    return {};
  },
  props: ["deletedUserName"],
  methods: {
    confirmDeleting: function() {
      this.$emit("deleteConfirmEvent", this.deletedUserName);
    },
    cancelDeleting: function() {
      this.$emit("deleteCancelEvent");
    },
  },
};
</script>

<style></style>
