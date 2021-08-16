<template>
  <v-container>
    <v-row>
      <v-col>
        <sessionNameTextField
          v-model="sessionName"
          :class="{ textFieldError: isError }"
        ></sessionNameTextField>
        <p v-if="isError">{{ errorMessage }}</p>
      </v-col>
      <v-btn @click="checkSessionNameAndEmitEvent">共有</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import sessionNameTextField from "./../components/sessionNameTextField.vue";
import constants from "./../constants";
import axios from "axios";

export default {
  name: "shareAndLoadForm",
  components: { sessionNameTextField },
  props: [""],
  data: function() {
    return {
      sessionName: "",
      errorMessage: "",
      isError: false,
    };
  },
  computed: {},
  methods: {
    checkSessionNameAndEmitEvent() {
      // const params = new URLSearchParams();
      // params.append("sessionName", this.sessionName);

      const axiosConfig = {
        method: "post",
        url: "checkSessionName",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        // data: params,
        data: { sessionName: this.sessionName },
      };

      let _this = this;
      axios(axiosConfig)
        .then(function(response) {
          console.log(response.data.result);
          if (response.data.result === constants.sessionNameDuplicateError) {
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
  },
};
</script>

<style scoped>
.textFieldError {
  color: red;
}
</style>
