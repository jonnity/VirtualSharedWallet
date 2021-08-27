<template>
  <v-container>
    <v-row align="center">
      <v-col>
        <userTextField v-model="inputtedUserName"></userTextField>
      </v-col>
      <v-col>
        <v-btn
          @click="formatNameAndEmitEvent"
          :disabled="inputtedUserName === ''"
          large
          color="primary"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userTextField from "../components/userTextField.vue";

export default {
  name: "appendUserForm",
  components: {
    userTextField,
  },
  props: ["userNameList"],
  data: function() {
    return {
      inputtedUserName: "",
    };
  },
  methods: {
    formatNameAndEmitEvent: function() {
      let appendedUserName = this.inputtedUserName;
      // 入力文字列+"_"+数字 に一致する正規表現
      const sameNameReg = new RegExp(this.inputtedUserName + "(_[0-9]*)?");
      // sameNameRegで一致する文字列のみを残したリストを作成
      const sameNames = this.userNameList.filter(function(name) {
        return name.search(sameNameReg) != -1;
      });
      // console.log(this.inputtedUserName);
      // console.log(sameNames);
      // console.log(sameNameReg);
      const sameNameMenberNum = sameNames.length;
      if (sameNameMenberNum > 0) {
        appendedUserName =
          this.inputtedUserName + "_" + (sameNameMenberNum + 1);
      }

      this.$emit("appendUserEvent", appendedUserName);

      this.inputtedUserName = "";
    },
  },
};
</script>

<style scoped></style>
