<template>
    <v-sheet
        class="ma-2"
        color="#FFF9C4"
        elevation="6"
        rounded=true
    >
        <v-container>
            <v-row class="ma-1" id="id_userName">
                <span>{{ userName }}</span>
                <v-spacer></v-spacer>
                <v-btn
                    @click="deleteUser"
                    icon
                >
                    <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </v-row>
            <v-row class="ml-1" align="center">
                <v-col class="pa-1">
                    <moneyTextField
                        v-model.number="paymentAmount"
                    ></moneyTextField>
                </v-col>
                <v-col class="pa-1">
                    <v-btn
                        small
                        color="warning"
                        fab
                        dark
                        @click="addPaymentAmount"
                    >
                        <v-img src="./../assets/支払い加算.png" width=25 height=25 contain></v-img>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="ml-1">
                <v-col class="pa-1">
                    <span>累計支払金額：{{ userPayedAmount | floorToTenths }}</span>
                </v-col>
            </v-row>
            <v-row class="ml-1">
                <v-col class="pa-1 mb-3">
                    <span
                        v-bind:class="userSplitPayment>0 ? 'class_profit' : userSplitPayment<0 ? 'class_loss' : 'class_just'"
                    >
                        調整金額：{{ userSplitPayment | floorToTenths }}
                    </span>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script>
import moneyTextField from './moneyTextField.vue';

export default {
    name: "userInfo",
    components: {
        moneyTextField,
    },
    props: ["userName", "averagePayment", "userPayedAmount"],
    data: function () {
        return {
            "paymentAmount": "",
        };
    },
    computed: {
        userSplitPayment: function(){
            return this.averagePayment - this.userPayedAmount;
        },
    },
    methods: {
        addPaymentAmount: function(){
            const integerPaymentAmount = Math.floor(this.paymentAmount);
            this.$emit("userPayEvent", {
                name: this.userName,
                amount: integerPaymentAmount,
            });
            this.paymentAmount = "";
        },
        deleteUser(){
            this.$emit("deleteUserEvent", this.userName);
        },
    },
    filters: {
        floorToTenths: function(number){
            // 小数点第一位まで残して切り捨て
            return Math.floor(number*10)/10;
        },
    },
};
</script>

<style scoped>
.class_profit {
    font-weight: bold;
}
.class_loss {
    color: red;
}
.class_just {
    color: #666;
    font-weight: bold;
}

#id_userName {
    font-size: 20px;
    font-weight: bold;
}
</style>
