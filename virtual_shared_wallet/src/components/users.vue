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
            <p>{{ totalPayment }}</p>
        </v-row>
        <v-row>
            <userInfo id="id_user01" v-if="userNum>=1"  :userName="userNameList[0]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user02" v-if="userNum>=2"  :userName="userNameList[1]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user03" v-if="userNum>=3"  :userName="userNameList[2]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user04" v-if="userNum>=4"  :userName="userNameList[3]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user05" v-if="userNum>=5"  :userName="userNameList[4]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user06" v-if="userNum>=6"  :userName="userNameList[5]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user07" v-if="userNum>=7"  :userName="userNameList[6]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user08" v-if="userNum>=8"  :userName="userNameList[7]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user09" v-if="userNum>=9"  :userName="userNameList[8]" @userPayEvent="calcTotalPayment"></userInfo>
            <userInfo id="id_user10" v-if="userNum>=10" :userName="userNameList[9]" @userPayEvent="calcTotalPayment"></userInfo>
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
    methods:{
        appendUser: function(){
            this.userNum++;
            this.userNameList.append(this.appendedUserName);
        },
        calcTotalPayment: function(payment_amount){
            this.totalPayment += payment_amount;
        }
    }
}
</script>