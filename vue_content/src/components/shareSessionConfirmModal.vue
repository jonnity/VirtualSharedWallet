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
          <v-text-field
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min8]"
            :type="show ? 'text' : 'password'"
            label="パスワード"
            @click:append="show = !show"
            :disabled="!enablePassword"
          >
          </v-text-field>
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
export default {
  name: "shareSessionConfirmModal",
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
