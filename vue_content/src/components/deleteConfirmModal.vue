<template>
  <div class="modal_overlay">
    <v-card
      class="modal_contents"
      color="white"
      v-click-outside="cancelDeleting"
    >
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-row> {{ deletedUserName }} さんを削除します。</v-row>
          </v-col>
          <v-col cols="4" align-self="end">
            <v-row justify="end">
              <v-btn @click="cancelDeleting">
                キャンセル
              </v-btn>
              <v-btn icon @click="confirmDeleting">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-row>
          </v-col>
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
