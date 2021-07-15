<template>
    <v-container>
        <v-row align="start">
            <v-col>
                <v-text-field
                    type="text"
                    v-model="appendedUserName"
                    label="登録するユーザーの名前"
                    filled
                    placeholder="割勘 太郎"
                    height="40px"
                ></v-text-field>
            </v-col>
            <v-col>
                <v-btn
                    @click="appendUser"
                    :disabled="appendedUserName===''"
                    x-large
                    color="primary"
                >
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>  
            <p :class="{ disabledContent: !multiUsers }">総額：{{ totalPayment }}</p>
        </v-row>
        <v-row>
            <p :class="{ disabledContent: !multiUsers }">一人あたり：{{ averagePayment }}</p>
        </v-row>
        <v-row >
            <p v-if="userNum >= 2 && hasFraction"  :class="{ disabledContent: !multiUsers }">誰かが「{{userNum}}で割って{{ mod }}余る数字」円払うと端数がなくなります</p>
            <p v-if="userNum < 2 || !hasFraction" :class="{ disabledContent: !multiUsers }">端数はありません</p>
        </v-row>
        <v-row>
            <div v-for="un in userIterator" :key="un">
                <userInfo
                    v-if="userNum>=un"
                    :userName="userNameList[un-1]"
                    :averagePayment="averagePayment"
                    :userPayedAmount="paymentList[un-1]"
                    @userPayEvent="calcTotalPayment"
                ></userInfo>
            </div>
        </v-row>
        <v-row>
            <repayment
                v-if="userNum >= 2"
                :userNameList="userNameList"
                @repaymentEvent="calcRepayment"
            >
            </repayment>
        </v-row>
    </v-container>
</template>

<script>
import Vue from 'vue';
import userInfo from "./userInfo.vue";
import repayment from "./repayment.vue";

export default {
    name: "users",
    components: {
        userInfo,
        repayment,
    },
    data(){
        return{
            appendedUserName: "",
            userNum: 0,
            totalPayment: 0,
            userNameList: [],
            paymentList: [],
        }
    },
    computed: {
        averagePayment: function(){
            return this.userNum===0 ? 0 : this.totalPayment/this.userNum;
        },
        userIterator: function(){
            let range = [];
            for(let i = 1; i <= this.userNum; i++){
                range.push(i);
            }
            return range;
        },
        mod: function(){
            return this.userNum != 0 ? this.userNum - (this.totalPayment % this.userNum) : 0;
        },
        hasFraction: function(){
            return (this.totalPayment % this.userNum) !== 0
        },
        multiUsers: function(){
            return this.userNum >= 2 ? true : false;
        },
    },
    methods: {
        appendUser: function(){
            this.userNum++;
            this.userNameList.push(this.appendedUserName);
            this.paymentList.push(0);
            this.appendedUserName = "";
        },
        calcTotalPayment: function(paymentInfo){
            const paymentUserNum = this.userNameList.indexOf(paymentInfo.name);
            this.paymentList[paymentUserNum] += paymentInfo.amount;
            this.totalPayment += paymentInfo.amount;
            this.totalPayment = Number(this.totalPayment);
        },
        calcRepayment: function(repaymentInfo){
            const payerIndex = this.userNameList.indexOf(repaymentInfo.payer);
            const receiverIndex = this.userNameList.indexOf(repaymentInfo.receiver);
            Vue.set(this.paymentList, payerIndex, this.paymentList[payerIndex]+repaymentInfo.amount);
            Vue.set(this.paymentList, receiverIndex, this.paymentList[receiverIndex]-repaymentInfo.amount);
        },
    },
}
</script>

<style scoped>
.disabledContent{
    color: #aaa;
}
</style>
