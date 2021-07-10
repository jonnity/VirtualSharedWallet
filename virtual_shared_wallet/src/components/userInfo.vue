<template>
    <v-sheet 
        class="ma-2"
        color="#FFF9C4"
        elevation="6"
        rounded=true
        >
        <v-container>
            <v-row>
                <span>{{ userName }}</span>
            </v-row>
            <v-row class="mb-0 pb-0">
                <v-col class="mb-0 pb-0">
                    <v-text-field
                        type="number"
                        v-model.number="payment_amount"
                        prefix="￥"
                        label="支払金額"
                        dence
                        solo
                    >
                    </v-text-field>
                </v-col>
                <v-col class="mb-0 pb-0">
                    <v-btn
                        small
                        color="warning"
                        fab
                        dark
                        @click="add_payment_amount()"
                    >
                        <!-- <v-icon>mdi-cash-multiple</v-icon> -->
                        <v-img src="./../assets/支払い加算.png" width=25 height=25 contain></v-img>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="my-0 py-0">
                <v-col class="mb-0 pb-0">
                    <span>累計支払金額：{{ userPayedMount }}</span>
                </v-col>
            </v-row>
            <v-row class="my-0 py-0">
                <v-col class="my-0 py-0">
                    <span
                        v-bind:class="userSplitPayment>0 ? 'class_profit' : userSplitPayment<0 ? 'class_loss' : 'class_just'"
                        >
                        調整金額：{{ userSplitPayment }}
                    </span>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script>
export default {
    props: ["userName"],
    data: function () {
        return {
            "userPayedMount": 0,
            "payment_amount": "",
            "userSplitPayment": 0,
        };
    },
    methods: {
        add_payment_amount: function(){
            this.userPayedMount += this.payment_amount;
            this.payment_amount = "";
            this.userPayedMount = Number(this.userPayedMount);
        },
    },
};
</script>

<style>
.class_profit {
    font-weight: bold;
}
.class_loss {
    color: red;
}
.class_just {
    color: #888;
    font-weight: bold;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    -moz-appearance:textfield;
}

</style>
