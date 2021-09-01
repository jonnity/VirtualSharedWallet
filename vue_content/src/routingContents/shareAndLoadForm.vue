<template>
  <div>
    <shareSessionConfirmModal
      v-if="shareFlag"
      @shareConfirmEvent="emitShareEvent"
      @shareCancelEvent="shareFlag = false"
    ></shareSessionConfirmModal>
    <loadSessionConfirmModal
      v-if="loadFlag"
      @loadConfirmEvent="emitLoadEvent"
      @loadCancelEvent="loadFlag = false"
    ></loadSessionConfirmModal>
    <confirmModal
      v-if="disconnectConfirmFlag"
      :confirmContents="disconnectConfirmContent"
      @confirmEvent="disconnectSession"
      @cancelEvent="disconnectConfirmFlag = false"
    ></confirmModal>
    <v-container>
      <v-row align="center">
        <v-col>
          <sessionNameTextField v-model="sessionName"></sessionNameTextField>
        </v-col>
        <v-col>
          <v-btn @click="checkSessionNameAndEmitShareEvent">共有</v-btn>
          <v-btn @click="checkSessionNameAndEmitLoadEvent">読込</v-btn>
          <v-btn @click="disconnectConfirmFlag = true">クリア</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <p v-if="isError" class="textFieldError">{{ errorMessage }}</p>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import sessionNameTextField from "./../components/sessionNameTextField.vue";
import shareSessionConfirmModal from "./../components/shareSessionConfirmModal.vue";
import loadSessionConfirmModal from "./../components/loadSessionConfirmModal.vue";
import confirmModal from "./../components/confirmModal.vue";

import constants from "./../constants";
import axios from "axios";

export default {
  name: "shareAndLoadForm",
  components: {
    sessionNameTextField,
    shareSessionConfirmModal,
    loadSessionConfirmModal,
    confirmModal,
  },
  props: [""],
  data: function() {
    return {
      sessionName: "",
      errorMessage: "",
      isError: false,
      shareFlag: false,
      loadFlag: false,
      disconnectConfirmFlag: false,
    };
  },
  computed: {
    disconnectConfirmContent() {
      const hasSessionConnection = this.$cookies.isKey(
        constants.sessionNameKey
      );
      if (hasSessionConnection) {
        const sessionName = this.$cookies.get(constants.sessionNameKey);
        return `セッション（${sessionName}）の接続を解除します．よろしいですか？（サーバにデータは残ります．）`;
      } else {
        return `セッション接続がないため，ローカルのデータが破棄されます．よろしいですか？`;
      }
    },
  },
  methods: {
    checkSessionNameAndEmitShareEvent() {
      const axiosConfigCheckSessionName = {
        method: "post",
        url: "dbAPI/checkSessionName",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: { sessionName: this.sessionName },
      };

      let _this = this;
      axios(axiosConfigCheckSessionName)
        .then(function(response) {
          console.log(response.data.result);
          if (response.data.result === constants.sessionNameDuplicate) {
            _this.errorMessage = "そのセッション名は使われています";
            _this.isError = true;
          } else {
            _this.isError = false;
            // _this.$emit("shareEvent", _this.sessionName);
            _this.shareFlag = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    checkSessionNameAndEmitLoadEvent() {
      const axiosConfigCheckSessionName = {
        method: "post",
        url: "dbAPI/checkSessionName",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: { sessionName: this.sessionName },
      };

      let _this = this;
      axios(axiosConfigCheckSessionName)
        .then(function(response) {
          console.log(response.data.result);
          if (response.data.result === constants.sessionNameDuplicate) {
            _this.loadFlag = true;
            _this.isError = false;
          } else {
            _this.errorMessage = "そのセッションは存在しません";
            _this.isError = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    emitShareEvent(password) {
      this.$emit("shareEvent", {
        password: password,
        sessionName: this.sessionName,
      });
      this.shareFlag = false;
    },
    emitLoadEvent() {
      this.$emit("loadEvent", this.sessionName);
      this.loadFlag = false;
    },
    disconnectSession() {
      // remove all cookie
      this.$cookies.keys().forEach((cookie) => this.$cookies.remove(cookie));
      this.disconnectConfirmFlag = false;
      this.$emit("disconnectEvent");
    },
  },
};
</script>

<style scoped>
.textFieldError {
  color: red;
}
</style>
