<template>
  <div class="modal_overlay">
    <v-card
      class="modal_contents"
      color="white"
      v-click-outside="cancelSharing"
    >
      <v-container>
        <v-row justify="center" align="center">
          <input type="checkbox" v-model="enablePassword" />
          <span class="px-1">パスワードを設定する</span>
        </v-row>
        <v-row justify="center">
          <passwordTextField
            v-model="password"
            :enablePassword="enablePassword"
          ></passwordTextField>
        </v-row>
        <v-row justify="center">
          <v-btn @click="cancelSharing">
            キャンセル
          </v-btn>
          <v-btn
            @click="confirmSharing"
            :disabled="password.length < 8 && enablePassword"
          >
            共有
          </v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import passwordTextField from "./passwordTextField.vue";
export default {
  name: "shareSessionConfirmModal",
  components: {
    passwordTextField,
  },
  data() {
    return {
      password: "",
      enablePassword: true,
    };
  },
  methods: {
    confirmSharing: function() {
      if (this.enablePassword) {
        this.$emit("shareConfirmEvent", this.password);
      } else {
        this.$emit("shareConfirmEvent", "");
      }
    },
    cancelSharing: function() {
      this.$emit("shareCancelEvent");
    },
  },
};
</script>

<style></style>
