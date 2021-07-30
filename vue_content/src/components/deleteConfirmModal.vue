<template>
  <div class="modal_overlay">
    <v-card class="modal_contents" color="white">
      <p>{{ deletedUserName }}を削除します。</p>
      <p>
        よろしいですか？
      </p>
      <v-btn icon @click="confirmDeleting">
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
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
  },
};
</script>

<style></style>
