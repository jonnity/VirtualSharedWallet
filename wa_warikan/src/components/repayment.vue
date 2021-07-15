<template>
    <v-container>
        <v-row>
            <v-text-field
                type="number"
                v-model.number="paymentAmount"
                prefix="￥"
                label="支払金額"
                dence
                solo
            ></v-text-field>
        </v-row>
        <v-row>
            <v-col>
                <v-select
                    :items="userNameList"
                    v-model="payer"
                    filled
                    label="払う人"
                ></v-select>
            </v-col>
            <v-col>
                <v-select
                    :items="userNameList"
                    v-model="receiver"
                    filled
                    label="受け取る人"
                ></v-select>
            </v-col>
            <v-col cols=2>
                <v-btn
                    @click="repayment"
                    color="warning"
                    x-large
                >
                    <v-icon color="black">mdi-cash-refund</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "repayment",
    props: ["userNameList"],
    data: function () {
        return {
            payer: "",
            receiver: "",
            paymentAmount: "",
        };
    },
    computed: {
    },
    methods: {
        repayment: function(){
            const integerPaymentAmount = Math.floor(this.paymentAmount);
            this.$emit("repaymentEvent", {
                payer: this.payer,
                receiver: this.receiver,
                amount: integerPaymentAmount,
            });
            this.paymentAmount = "";
        },
    },
};
</script>

<style scoped>
</style>
