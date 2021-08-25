<template>
  <div>
    <shareLinkModal
      v-if="shareLinkFlag"
      :shareLink="shareLink"
      @closeModal="shareLinkFlag = false"
    ></shareLinkModal>
    <passwordModal
      v-if="passwordModalFlag"
      :sessionName="loadSessionName"
      @closeModal="passwordModalFlag = false"
      @inputPasswordEvent="saveEncryptedPasswordToCookieAndUpdate"
    ></passwordModal>
    <v-container>
      <appBar
        :userNameList="userNameList"
        @appendUserEvent="appendUser"
        @repaymentEvent="calcRepayment"
        @clickHelpButton="$emit('clickHelpButton')"
        @shareEvent="uploadAndShare"
        @loadEvent="loadUserInfo"
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
import passwordModal from "./passwordModal.vue";

import constants from "./../constants";

Vue.use(VueCookies);

export default {
  name: "userRoot",
  components: {
    userInfo,
    appBar,
    shareLinkModal,
    passwordModal,
  },
  data() {
    return {
      userNameList: [],
      paymentList: [],
      shareLink: "",
      shareLinkFlag: false,
      loadSessionName: "",
      passwordModalFlag: false,
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
    existSessionNameCookie() {
      return (
        this.$cookies.isKey(constants.sessionNameKey) &&
        this.$cookies.get(constants.sessionNameKey) !== ""
      );
    },
    existPasswordCookie() {
      return (
        this.$cookies.isKey(constants.passwordKey) &&
        this.$cookies.get(constants.passwordKey) !== ""
      );
    },
  },
  methods: {
    appendUser: function(appendedUserName) {
      // ローカルの処理
      this.userNameList.push(appendedUserName);
      this.paymentList.push(0);

      // sessionNameがあったらDBアクセスしてその状態に上書き
      if (this.existSessionNameCookie && this.existPasswordCookie) {
        const sessionName = this.$cookies.get(constants.sessionNameKey);
        const encryptedPassword = this.$cookies.get(constants.passwordKey);
        const data = {
          sessionName: sessionName,
          encryptedPassword: encryptedPassword,
          userName: appendedUserName,
        };
        const axiosConfigAppendUser = {
          method: "post",
          url: "dbAPI/appendUser",
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let _this = this;
        axios(axiosConfigAppendUser)
          .then(function(response) {
            console.log(response);
            if (response.result === constants.success) {
              _this.updataUserInfoFromDB(sessionName);
            } else if (response.result === constants.wrongPassword) {
              alert(constants.wrongPasswordMessage);
              _this.updateUserInfo();
            }
          })
          .catch(function(error) {
            _this.$cookies.remove(constants.sessionNameKey);
            console.log(error);
          })
          .finally(function() {
            _this = null;
          });
      } else {
        this.updateUserInfo();
      }
    },
    calcTotalPayment: function(paymentInfo) {
      const paymentUserIndex = this.userNameList.indexOf(paymentInfo.name);

      // ローカル処理
      Vue.set(
        this.paymentList,
        paymentUserIndex,
        this.paymentList[paymentUserIndex] + paymentInfo.amount
      );
      if (this.existSessionNameCookie) {
        const sessionName = this.$cookies.get(constants.sessionNameKey);

        const data = {
          sessionName: sessionName,
          userName: paymentInfo.name,
          paymentAmount: paymentInfo.amount,
        };
        const axiosConfigUpdatePayment = {
          method: "post",
          url: "dbAPI/updatePayment",
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let _this = this;
        axios(axiosConfigUpdatePayment)
          .then(function(response) {
            if (response === constants.success) {
              _this.updataUserInfoFromDB(sessionName);
            }
          })
          .catch(function(error) {
            _this.$cookies.remove(constants.sessionNameKey);
            console.log(error);
          })
          .finally(function() {
            _this = null;
          });
      }
    },
    calcRepayment: function(repaymentInfo) {
      const payerIndex = this.userNameList.indexOf(repaymentInfo.payer);
      const receiverIndex = this.userNameList.indexOf(repaymentInfo.receiver);

      // ローカル処理
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
      // DB処理
      if (this.existSessionNameCookie) {
        const sessionName = this.$cookies.get(constants.sessionNameKey);

        const data = {
          sessionName: sessionName,
          payer: repaymentInfo.payer,
          receiver: repaymentInfo.receiver,
          paymentAmount: repaymentInfo.amount,
        };
        const axiosConfigUpdatePayment = {
          method: "post",
          url: "dbAPI/repayment",
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let _this = this;
        axios(axiosConfigUpdatePayment)
          .then(function(response) {
            if (response === constants.success) {
              _this.updataUserInfoFromDB(sessionName);
            }
          })
          .catch(function(error) {
            _this.$cookies.remove(constants.sessionNameKey);
            console.log(error);
          })
          .finally(function() {
            _this = null;
          });
      }
    },
    deleteUser: function(userName) {
      const userIndex = this.userNameList.indexOf(userName);

      // ローカルの処理
      this.userNameList.splice(userIndex, 1);
      this.paymentList.splice(userIndex, 1);

      if (this.existSessionNameCookie) {
        const sessionName = this.$cookies.get(constants.sessionNameKey);
        const data = {
          sessionName: sessionName,
          userName: userName,
        };
        const axiosConfigDeleteUser = {
          method: "post",
          url: "dbAPI/deleteUser",
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let _this = this;
        axios(axiosConfigDeleteUser)
          .then(function(response) {
            if (response === constants.success) {
              _this.updataUserInfoFromDB(sessionName);
            }
          })
          .catch(function(error) {
            _this.$cookies.remove(constants.sessionNameKey);
            console.log(error);
          })
          .finally(function() {
            _this = null;
          });
      }
    },
    uploadAndShare: function(sessionInfo) {
      const data = {
        sessionName: sessionInfo.sessionName,
        password: sessionInfo.password,
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
          if (response.data.result === constants.success) {
            _this.shareLink = response.data.shareLink;
            _this.shareLinkFlag = true;
            _this.$cookies.set(
              constants.sessionNameKey,
              sessionInfo.sessionName
            );
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    loadUserInfo: function(sessionName) {
      window.location.href = constants.appURL + "?sessionName=" + sessionName;
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
    wrongPasswordProcess() {
      alert(constants.wrongPasswordMessage);
      this.$cookies.remove(constants.passwordKey);
      this.updateUserInfo();
    },
    updataUserInfoFromDB: function(sessionName) {
      // passwordがcookieになかったら，パスワード要求して終わり
      // いらない？全体のフロー見ないとわかんない
      // たぶんいらんけど念の為
      if (!this.$cookies.isKey(constants.passwordKey)) {
        this.passwordModalFlag = true;
        return;
      }
      const axiosConfigToGetUserInfo = {
        method: "post",
        url: "dbAPI/getUserInfo",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          sessionName: sessionName,
          encryptedPassword: this.$cookies.get(constants.passwordKey),
        },
      };

      let _this = this;
      axios(axiosConfigToGetUserInfo)
        .then(function(response) {
          console.log(response.data.result);
          if (response.data.result === constants.success) {
            _this.userNameList = response.data.userNameList;
            _this.paymentList = response.data.paymentList;
          } else if (response.data.result === constants.wrongPassword) {
            _this.wrongPasswordProcess();
          }
        })
        .catch(function(error) {
          _this.$cookies.remove(constants.sessionNameKey);
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    updateUserInfo: async function() {
      const sessionName = this.$route.query.sessionName;
      // クエリパラメータにsessionNameがあるか
      const existSessionNameQuery =
        sessionName !== undefined && sessionName !== "";

      // どこにもsessionNameがなければローカルで処理する
      if (!existSessionNameQuery && !this.existSessionNameCookie) {
        this.updateUserInfoFromCookie();
        return;
      }

      // sessionNameの情報はクエリパラメータ優先
      if (existSessionNameQuery) {
        this.$cookies.set(constants.sessionNameKey, sessionName);
        this.loadSessionName = sessionName;
      } else if (this.existSessionNameCookie) {
        this.loadSessionName = this.$cookies.get(constants.sessionNameKey);
      }

      const existPassword = await this.checkExistPassword(this.loadSessionName);
      // パスワードが設定されていて、かつ、cookieに保存されていないときに入力欄を表示
      if (!existPassword) {
        this.saveEncryptedPasswordToCookieAndUpdate("");
      } else if (this.$cookies.isKey(constants.passwordKey)) {
        this.updataUserInfoFromDB(this.loadSessionName);
      } else {
        // passwordをcookieに保存してここに戻ってくる
        // modalのイベント発火でsaveEncryptedPasswordToCookieAndUpdateが呼ばれて
        // その最後にupdateUserInfoが呼ばれる
        this.passwordModalFlag = true;
      }
    },
    async checkExistPassword(sessionName) {
      const data = {
        sessionName: sessionName,
      };
      const axiosConfig = {
        method: "post",
        url: "dbAPI/checkExistPassword",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      let existPassword = true;
      // let _this = this;
      await axios(axiosConfig)
        .then(function(response) {
          if (response.data.result === constants.success) {
            existPassword = response.data.existPassword;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      // .finally(function() {
      //   _this = null;
      // });
      return existPassword;
    },
    saveEncryptedPasswordToCookieAndUpdate(password) {
      this.passwordModalFlag = false;
      const axiosConfigSaveEncryptedPassword = {
        method: "post",
        url: "dbAPI/encryptPassword",
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: { password: password },
      };
      let _this = this;
      axios(axiosConfigSaveEncryptedPassword)
        .then(function(response) {
          _this.$cookies.set(
            constants.passwordKey,
            response.data.encryptedPassword
          );
          _this.updateUserInfo();
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          _this = null;
        });
    },
    // inputedPassword(password) {},
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
