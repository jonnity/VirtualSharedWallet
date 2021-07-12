<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field
                    type="text"
                    v-model="appendedUserName"
                    label="登録するユーザーの名前"
                    solo
                    placeholder="割勘 太郎"
                >
                </v-text-field>
            </v-col>
            <v-col>
                <v-btn
                    @click="appendUser"
                    :disabled="userNum>=10"
                    large
                    color="primary"
                    dark
                >
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>  
            <p>総額：{{ totalPayment }}</p>
        </v-row>
        <v-row>
            <p v-if="userNum >= 2">一人あたり：{{ averagePayment }}</p>
        </v-row>
        <!-- <v-row>
            <p v-if="userNum >= 2">誰かが「{{userNum}}で割って{{ mod }}余る数字」円払うと端数がなくなります</p>
        </v-row> -->
        <v-row>
            <div v-for="un in userIterator" :key="un">
                <userInfo v-if="userNum>=un" :userName="userNameList[un-1]" :averagePayment="averagePayment" @userPayEvent="calcTotalPayment"></userInfo>
            </div>
        </v-row>
    </v-container>
</template>

<script>
// import Vue from 'vue';
import userInfo from './userInfo.vue';

export default {
    name: "users",
    components: {
        userInfo
    },
    data: function(){
        return{
            appendedUserName: "",
            userNum: 0,
            totalPayment: 0,
            userNameList: [],
        }
    },
    methods: {
        appendUser: function(){
            this.userNum++;
            this.userNameList.push(this.appendedUserName);
            this.appendedUserName = "";
        },
        calcTotalPayment: function(payment_amount){
            this.totalPayment += payment_amount;
            this.totalPayment = Number(this.totalPayment)
        },
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
            console.log(range);
            return range;
        },
        mod: function(){
            return this.userNum===0 ? 0 : this.totalPayment % this.userNum;
        }
    },
}
</script>