<template>
    <v-container>
        <v-row id="id_user_name">
            <p>{{userName}}</p>
        </v-row>
        <v-row id="id_user_payment">
            <v-column>
                <p>支払金額：{{userPayedMount}}</p>
                <v-text-field
                    label="Amount"
                    value="0"
                    prefix="￥"
                ></v-text-field>
                <div class="my-2">
                    <v-btn
                        color="warning"
                        fab
                        dark>
                        <v-img 
                            height=auto
                            width=20px
                            src="./../assets/お札のアイコン_矢印付き.svg">
                        </v-img>
                    </v-btn>
                </div>

                <button id="id_button_pay">加算</button>
            </v-column>
        </v-row>
        <v-row id="id_user_split_payment">
            <span>調整金額：</span>
            <span>{{userSplitPayment}}</span>
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
            userPaymentTpSplit: 0
        }
    }
}
</script>

<style>
    /* #id_user_payment p{
        margin-bottom: 0%;
    } */
    v-row{
        margin-bottom: 8px;
    }
</style>