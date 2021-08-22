<template>
  <div>
    <shareLinkModal
      v-if="shareLinkFlag"
      :shareLink="shareLink"
      @closeModal="shareLinkFlag = false"
    ></shareLinkModal>
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
  </div>
</template>

<script>
import Vue from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";

import userInfo from "./userInfo.vue";
import appBar from "./appBar.vue";
import shareLinkModal from "./shareLinkModal.vue";

import constants from "./../constants";

Vue.use(VueCookies);

export default {
  name: "userRoot",
  components: {
    userInfo,
    appBar,
    shareLinkModal,
  },
  data() {
    return {
      userNameList: [],
      paymentList: [],
      shareLink: "",
      shareLinkFlag: false,
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
      const data = {
        sessionName: sessionName,
        userNameList: this.userNameList,
        paymentList: this.paymentList,
      };
      const axiosConfigToShare = {
        method: "post",
        url: "dbAPI/resisterSession",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      let _this = this;
      axios(axiosConfigToShare)
        .then(function(response) {
          console.log(response.data);
          if (response.data.result === constants.success) {
            _this.shareLink = response.data.shareLink;
            _this.shareLinkFlag = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    updateUserInfoFromCookie: function() {
      // どちらかのキーがなかったら中止
      if (
        !this.$cookies.isKey("userNameList") ||
        !this.$cookies.isKey("paymentList")
      ) {
        this.userNameList = [];
        this.paymentList = [];
        return;
      }
      let tempUserNameListCookie = this.$cookies.get("userNameList");
      let tempPaymentListCookie = this.$cookies.get("paymentList");

      if (tempUserNameListCookie === null || tempPaymentListCookie === null) {
        alert("データが破損しています。");
        this.userNameList = [];
        this.paymentList = [];
        return;
      }
      this.userNameList = tempUserNameListCookie.split(",");
      let tempPaymentList = tempPaymentListCookie.split(",");
      this.paymentList = tempPaymentList.map(function(paymentStr) {
        return Number(paymentStr);
      });
    },
    setUserInfoToCookie: function() {
      this.$cookies.set("userNameList", this.userNameList);
      this.$cookies.set("paymentList", this.paymentList);
    },
    updataUserInfoFromDB: function(sessionName) {
      const axiosConfigToGetUserInfo = {
        method: "post",
        url: "dbAPI/getUserInfo",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: { sessionName: sessionName },
      };

      let _this = this;
      axios(axiosConfigToGetUserInfo)
        .then(function(response) {
          _this.userNameList = response.data.userNameList;
          _this.paymentList = response.data.paymentList;
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    updateUserInfo: function() {
      const sessionName = this.$route.query.sessionName;
      // クエリパラメータにsessionNameが適切にあるか
      if (sessionName !== undefined && sessionName !== "") {
        this.updataUserInfoFromDB(sessionName);
      } else {
        this.updateUserInfoFromCookie();
      }
    },
  },
  updated: function() {
    this.$nextTick(function() {
      this.setUserInfoToCookie();
    });
  },
  mounted: function() {
    this.$nextTick(function() {
      this.updateUserInfo();
    });
  },
};
</script>

<style scoped>
.disabledContent {
  color: #aaa;
}
</style>
