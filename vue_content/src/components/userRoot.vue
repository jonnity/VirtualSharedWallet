<template>
  <v-container>
    <appBar
      :userNameList="userNameList"
      @appendUserEvent="appendUser"
      @repaymentEvent="calcRepayment"
      @clickHelpButton="$emit('clickHelpButton')"
      @shareEvent="uploadAndShare"
    ></appBar>
    <v-row class="pa-2">
      <div v-for="un in userIterator" :key="un">
        <userInfo
          :userName="userNameList[un - 1]"
          :userPayedAmount="paymentList[un - 1]"
          :averagePayment="averagePayment"
          @userPayEvent="calcTotalPayment"
          @deleteUserEvent="deleteUser"
        ></userInfo>
      </div>
    </v-row>
    <div class="pa-6">
      <p :class="{ disabledContent: userNameList.length < 2 }">
        総額：{{ totalPayment }}円
      </p>
      <p :class="{ disabledContent: userNameList.length < 2 }">
        一人あたり：{{ averagePayment }}円
      </p>
      <p
        v-if="userNameList.length >= 2 && hasFraction"
        :class="{ disabledContent: userNameList.length < 2 }"
      >
        誰かが「{{ userNameList.length }}で割って{{
          mod
        }}余る数字」円払うと端数がなくなります
      </p>
      <p
        v-if="userNameList.length < 2 || !hasFraction"
        :class="{ disabledContent: userNameList.length < 2 }"
      >
        端数はありません
      </p>
    </div>
  </v-container>
</template>

<script>
import Vue from "vue";
import userInfo from "./userInfo.vue";
import appBar from "./appBar.vue";
import VueCookies from "vue-cookies";
import axios from "axios";

Vue.use(VueCookies);

export default {
  name: "userRoot",
  components: {
    userInfo,
    appBar,
  },
  data() {
    return {
      userNameList: [],
      paymentList: [],
    };
  },
  computed: {
    averagePayment: function() {
      return this.userNameList.length === 0
        ? 0
        : this.totalPayment / this.userNameList.length;
    },
    userIterator: function() {
      let range = [];
      for (let i = 1; i <= this.userNameList.length; i++) {
        range.push(i);
      }
      return range;
    },
    mod: function() {
      return this.userNameList.length != 0
        ? this.userNameList.length -
            (this.totalPayment % this.userNameList.length)
        : 0;
    },
    hasFraction: function() {
      return this.totalPayment % this.userNameList.length !== 0;
    },
    totalPayment: function() {
      let totalPayment = 0;
      for (let i = 0; i < this.paymentList.length; i++) {
        totalPayment += this.paymentList[i];
      }
      return totalPayment;
    },
  },
  methods: {
    appendUser: function(appendedUserName) {
      this.userNameList.push(appendedUserName);
      this.paymentList.push(0);
    },
    calcTotalPayment: function(paymentInfo) {
      const paymentUserIndex = this.userNameList.indexOf(paymentInfo.name);
      Vue.set(
        this.paymentList,
        paymentUserIndex,
        this.paymentList[paymentUserIndex] + paymentInfo.amount
      );
    },
    calcRepayment: function(repaymentInfo) {
      const payerIndex = this.userNameList.indexOf(repaymentInfo.payer);
      const receiverIndex = this.userNameList.indexOf(repaymentInfo.receiver);
      Vue.set(
        this.paymentList,
        payerIndex,
        this.paymentList[payerIndex] + repaymentInfo.amount
      );
      Vue.set(
        this.paymentList,
        receiverIndex,
        this.paymentList[receiverIndex] - repaymentInfo.amount
      );
    },
    deleteUser: function(userName) {
      const userIndex = this.userNameList.indexOf(userName);
      this.userNameList.splice(userIndex, 1);
      this.paymentList.splice(userIndex, 1);
    },
    uploadAndShare: function(sessionName) {
      const axiosConfig = {
        method: "post",
        url: "shareSession",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: { sessionName: sessionName },
      };

      // let _this = this;
      axios(axiosConfig)
        .then(function(response) {
          console.log(response.data.result);
        })
        .catch(function(error) {
          console.log(error);
        });
      // .finally(function() {
      //   _this = null;
      // });
    },
  },
  updated: function() {
    this.$cookies.set("userNameList", this.userNameList);
    this.$cookies.set("paymentList", this.paymentList);
  },
  mounted: function() {
    let tempUserNameList = "";
    let tempPaymentList = "";
    if (
      !(
        this.$cookies.isKey("userNameList") &&
        this.$cookies.isKey("paymentList")
      )
    ) {
      return;
    } else {
      tempUserNameList = this.$cookies;
      tempPaymentList = this.$cookies;
    }

    if (tempUserNameList === "" || tempPaymentList === "") {
      return;
    } else {
      this.userNameList = tempUserNameList.get("userNameList").split(",");
      tempPaymentList = tempPaymentList.map(function(paymentStr) {
        return Number(paymentStr);
      });
      this.paymentList = tempPaymentList.get("paymentList").split(",");
    }
  },
};
</script>

<style scoped>
.disabledContent {
  color: #aaa;
}
</style>
