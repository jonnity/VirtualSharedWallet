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
          <span>
            {{ sessionName }}を読み込みます。パスワードを入力してください。
          </span>
          <span>
            （「共有」していないデータは破棄されます。）
          </span>
        </v-row>
        <v-row>
          <passwordTextField
            v-model="password"
            :enablePassword="true"
          ></passwordTextField>
        </v-row>
        <v-row>
          <v-btn @click="closeModal">キャンセル</v-btn>
          <v-btn @click="$emit('inputPasswordEvent', password)">決定</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import constants from "../constants";
import passwordTextField from "./passwordTextField.vue";

export default {
  name: "passwordModal",
  components: {
    passwordTextField,
  },
  data() {
    return { password: "" };
  },
  props: ["sessionName"],
  methods: {
    closeModal() {
      this.$cookies.remove(constants.sessionNameKey);
      this.$emit("closeModal");
    },
  },
};
</script>

<style></style>
