<template>
  <div id="overlay">
    <p>{{ deletedUserName }}を削除します。</p>
    <p>
      よろしいですか？
    </p>
    <v-btn icon @click="confirmDeleting">
      <v-icon>
        mdi-delete
      </v-icon>
    </v-btn>
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

<style scoped>
#overlay {
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
</style>
