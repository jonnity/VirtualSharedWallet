<template>
    <v-container>
        <p>仮置</p>
    </v-container>
</template>

<script>
// import moneyTextField from "../components/moneyTextField.vue"
export default {
    name: "tippingForm",
    components: {
        // moneyTextField,
    },
    // props: ["userNameList"],
    // data: function () {
    //     return {
    //         payer: "",
    //         receiver: "",
    //         paymentAmount: "",
    //     };
    // },
    // computed: {
    //     readyToRepayment: function(){
    //         const amountInputted = this.paymentAmount != "";
    //         const nameInputted = this.payer != "" && this.receiver != "";
    //         const nameDifference = this.payer != this.receiver;
    //         return amountInputted && nameInputted && nameDifference;
    //     }
    // },
    methods: {
        // tipping: function(){
        //     const integerPaymentAmount = Math.floor(this.paymentAmount);
        //     this.$emit("repaymentEvent", {
        //         payer: this.payer,
        //         receiver: this.receiver,
        //         amount: integerPaymentAmount,
        //     });
        //     this.paymentAmount = "";
        //     this.payer = "";
        //     this.receiver = "";
        // },
    },
};
</script>

<style scoped>
</style>
