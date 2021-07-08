<template>
    <v-container>
        <v-row id="id_user_name">
            <p>{{userName}}</p>
        </v-row>
        <v-row id="id_user_payment">
            <v-collum>
                <p>支払金額：{{userPayedMount}}</p>
                <p>
                    <input type="number"><button id="id_button_pay">加算</button>
                </p>
            </v-collum>
        </v-row>
        <v-row id="id_user_">
            <span>調整金額：</span>
            <span>{{userMountToSplitPay}}</span>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'userInfo',
    data: function(){
        return {
            userName: "割り勘太郎",
            userPayedMount: 0,
            userMountToSplitPay: 0
        }
    }
}
</script>

<style>
    .
</style>