<template>
    <v-container>
        <v-row id="id_user_name">
            <span>{{ userName }}</span>
        </v-row>
        <v-row id="id_user_payment" align-content="center" ma-0 pa-0>
            <v-col cols=2 class="mb-0 pb-0">
                <span>支払金額：{{ userPayedMount }}</span>
            </v-col>
        </v-row>
        <v-row id="id_pay_ope" class="mt-0 pt-0" align-content="center">
            <v-col cols=2 class="mt-0 pt-0">
                <v-text-field
                    type="number"
                    v-model.number="payment_amount"
                    prefix="￥"
                >
                </v-text-field>
            </v-col>
            <v-col cols=1>
                <v-btn
                    color="warning"
                    fab
                    dark
                    v-on:click="add_payment_amount"
                >
                    <v-icon>mdi-cash-multiple</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row id="id_user_split_payment">
            <span>調整金額：{{ userSplitPayment }}</span>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "userInfo",
    data: function () {
        return {
            userName: "割り勘太郎",
            userPayedMount: 0,
            payment_amount: "",
            userSplitPayment: 0,
        };
    },
    methods: {
        add_payment_amount: function(){
            this.userPayedMount += this.payment_amount;
            this.payment_amount = "";
        },
    },
};
</script>

<style>
/* #id_user_payment p{
        margin-bottom: 0%;
    } */
v-row {
    margin-bottom: 8px;
}
</style>
