<template>
  <v-container>
    <div v-if="userNameList.length < 2" id="id_user_shortage">
      <p>受け渡し機能を使うには2人以上のユーザーを追加してください</p>
    </div>
    <div v-if="userNameList.length >= 2">
      <v-row class="pa-3">
        <moneyTextField v-model.number="paymentAmount"></moneyTextField>
      </v-row>
      <v-row align="center">
        <v-col>
          <v-select
            :items="userNameList"
            v-model="payer"
            filled
            label="払う人"
            hide-details
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :items="userNameList"
            v-model="receiver"
            filled
            label="受け取る人"
            hide-details
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            @click="repayment"
            color="warning"
            x-large
            :disabled="!readyToRepayment"
          >
            <v-icon color="black">mdi-cash-refund</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import moneyTextField from "../components/moneyTextField.vue";
export default {
  name: "repaymentForm",
  components: {
    moneyTextField,
  },
  props: ["userNameList"],
  data: function() {
    return {
      payer: "",
      receiver: "",
      paymentAmount: "",
    };
  },
  computed: {
    readyToRepayment: function() {
      const amountInputted = this.paymentAmount != "";
      const nameInputted = this.payer != "" && this.receiver != "";
      const nameDifference = this.payer != this.receiver;
      return amountInputted && nameInputted && nameDifference;
    },
  },
  methods: {
    repayment: function() {
      const integerPaymentAmount = Math.floor(this.paymentAmount);
      this.$emit("repaymentEvent", {
        payer: this.payer,
        receiver: this.receiver,
        amount: integerPaymentAmount,
      });
      this.paymentAmount = "";
      this.payer = "";
      this.receiver = "";
    },
  },
};
</script>

<style scoped>
#id_user_shortage {
  font-weight: bold;
}
</style>
