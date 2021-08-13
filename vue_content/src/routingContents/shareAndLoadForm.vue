<template>
  <v-container>
    <v-row>
      <sessionNameTextField v-model="sessionName"></sessionNameTextField>
      <v-btn @click="checkSessionNameAndEmitEvent">共有</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import sessionNameTextField from "./../components/sessionNameTextField.vue";
import axios from "axios";

export default {
  name: "shareAndLoadForm",
  components: { sessionNameTextField },
  props: [""],
  data: function() {
    return {
      sessionName: "",
    };
  },
  computed: {},
  methods: {
    checkSessionNameAndEmitEvent() {
      const axiosTestConfig = {
        method: "get",
        url: "test",
        responseType: "json",
      };

      axios(axiosTestConfig).then(function(response) {
        console.log(response);
      });
      // this.$emit("shareEvent", this.sessionName);
    },
  },
};
</script>

<style scoped></style>
