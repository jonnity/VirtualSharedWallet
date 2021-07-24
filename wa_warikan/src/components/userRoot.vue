<template>
    <v-container>
        <appBar
            :userNameList="userNameList"
            :paymentList="paymentList"
            @appendUserEvent="appendUser"
            @repaymentEvent="calcRepayment"
        ></appBar>

        <v-row class="pa-2">
            <div v-for="un in userIterator" :key="un">
                <userInfo
                    :userName="userNameList[un-1]"
                    :userPayedAmount="paymentList[un-1]"
                    :averagePayment="averagePayment"
                    @userPayEvent="calcTotalPayment"
                    @deleteUserEvent="deleteUser"
                ></userInfo>
            </div>
        </v-row>
        <div class="pa-6">
            <p :class="{ disabledContent: userNameList.length < 2 }">総額：{{ totalPayment }}</p>
            <p :class="{ disabledContent: userNameList.length < 2 }">一人あたり：{{ averagePayment }}</p>
            <p v-if="userNameList.length >= 2 && hasFraction"  :class="{ disabledContent: userNameList.length < 2 }">誰かが「{{userNameList.length}}で割って{{ mod }}余る数字」円払うと端数がなくなります</p>
            <p v-if="userNameList.length < 2 || !hasFraction" :class="{ disabledContent: userNameList.length < 2 }">端数はありません</p>
        </div>
    </v-container>
</template>

<script>
import Vue from 'vue';
import userInfo from "./userInfo.vue";
import appBar from "./appBar.vue"

export default {
    name: "userRoot",
    components: {
        userInfo,
        appBar,
    },
    data(){
        return{
            userNameList: [],
            paymentList: [],
        }
    },
    computed: {
        averagePayment: function(){
            return this.userNameList.length===0 ? 0 : this.totalPayment/this.userNameList.length;
        },
        userIterator: function(){
            let range = [];
            for(let i = 1; i <= this.userNameList.length; i++){
                range.push(i);
            }
            return range;
        },
        mod: function(){
            return this.userNameList.length != 0 ? this.userNameList.length - (this.totalPayment % this.userNameList.length) : 0;
        },
        hasFraction: function(){
            return (this.totalPayment % this.userNameList.length) !== 0
        },
        totalPayment: function(){
            let totalPayment = 0;
            for(let i = 0; i < this.paymentList.length; i++){
                totalPayment += this.paymentList[i];
            }
            return totalPayment;
        },
    },
    methods: {
        appendUser: function(appendedUserName){
            this.userNameList.push(appendedUserName);
            this.paymentList.push(0);
        },
        calcTotalPayment: function(paymentInfo){
            const paymentUserIndex = this.userNameList.indexOf(paymentInfo.name);
            Vue.set(this.paymentList, paymentUserIndex, this.paymentList[paymentUserIndex] + paymentInfo.amount);
        },
        calcRepayment: function(repaymentInfo){
            const payerIndex = this.userNameList.indexOf(repaymentInfo.payer);
            const receiverIndex = this.userNameList.indexOf(repaymentInfo.receiver);
            Vue.set(this.paymentList, payerIndex, this.paymentList[payerIndex]+repaymentInfo.amount);
            Vue.set(this.paymentList, receiverIndex, this.paymentList[receiverIndex]-repaymentInfo.amount);
        },
        deleteUser: function(userName){
            const userIndex = this.userNameList.indexOf(userName);
            this.userNameList.splice(userIndex, 1)
            this.paymentList.splice(userIndex, 1)
        }
    },
}
</script>

<style scoped>
.disabledContent{
    color: #bbb;
}
</style>
