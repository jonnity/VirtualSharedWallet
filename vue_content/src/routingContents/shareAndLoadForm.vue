<template>
  <div>
    <loadSessionConfirmModal
      v-if="loadFlag"
      @loadConfirmEvent="emitLoadEvent"
      @loadCancelEvent="loadFlag = false"
    ></loadSessionConfirmModal>
    <v-container>
      <v-row align="center">
        <v-col>
          <sessionNameTextField v-model="sessionName"></sessionNameTextField>
        </v-col>
        <v-col>
          <v-btn @click="checkSessionNameAndEmitShareEvent">共有</v-btn>
          <v-btn @click="checkSessionNameAndEmitLoadEvent">読込</v-btn>
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
import loadSessionConfirmModal from "./../components/loadSessionConfirmModal.vue";

import constants from "./../constants";
import axios from "axios";

export default {
  name: "shareAndLoadForm",
  components: { sessionNameTextField, loadSessionConfirmModal },
  props: [""],
  data: function() {
    return {
      sessionName: "",
      errorMessage: "",
      isError: false,
      loadFlag: false,
    };
  },
  computed: {},
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
            _this.$emit("shareEvent", _this.sessionName);
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
    emitLoadEvent() {
      this.$emit("loadEvent", this.sessionName);
    },
  },
};
</script>

<style scoped>
.textFieldError {
  color: red;
}
</style>
