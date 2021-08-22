<template>
  <div class="modal_overlay">
    <v-card
      class="modal_contents"
      color="white"
      v-click-outside="cancelLoading"
    >
      <v-container>
        <v-row justify="center">
          <p>
            サーバからデータを読み込むと「共有」していないデータは消えてしまいます．よろしいですか？
          </p>
        </v-row>
        <v-row justify="center">
          <v-btn @click="cancelLoading">
            キャンセル
          </v-btn>
          <v-btn @click="confirmLoading">
            読み込む
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "loadSessionConfirmModal",
  data() {
    return {};
  },
  methods: {
    confirmLoading: function() {
      this.$emit("loadConfirmEvent");
    },
    cancelLoading: function() {
      this.$emit("loadCancelEvent");
    },
  },
};
</script>

<style></style>
