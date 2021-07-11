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
        <v-row id="id_users">
            <userInfo id="id_test_test" style="display: table;" @userPayEvent="calcTotalPayment"></userInfo>
        </v-row>
    </v-container>
</template>

<script>
import Vue from 'vue';
import userInfo from './userInfo.vue';

export default {
    name: "users",
    components: {
        userInfo
    },
    data: function(){
        return{
            appendedUserName: "",
            userNum: 1,
            totalPayment: 0,
        }
    },
    methods:{
        appendUser: function(){
            // const div = document.createElement('div');
            // const divHTML = '<userInfo id="id_user_' + this.userNum + '" @userPayEvent="calcTotalPayment"></userInfo>';
            // div.innerHTML = divHTML;
            // console.log(divHTML)
            // div.innerHTML = '<userInfo id="id_user_1 @userPayEvent="calcTotalPayment"></userInfo>';
            // document.getElementById('id_users').appendChild(div);
            
            const userComponent = Vue.extend(userInfo);
            const instance = new userComponent({
                template: '<userInfo id="id_user_1 @userPayEvent="calcTotalPayment"></userInfo>',
                propsData: {
                    userName: this.appendedUserName
                },
                parent: this
            });
            // instance.$mount("#user_" + this.userNum);
            instance.$mount();
            // document.getElementById('id_user_' + this.userNum).appendChild(instance.$el);
            document.getElementById('id_users').appendChild(instance.$el);
            // instance.$parent = document.getElementById("id_component_users")
            console.log(this)
            console.log(instance.$el)
            
            this.userNum++;
            this.appendedUserName = "";
            // console.log(this.$parent.$el);
            // console.log(instance);
            // console.log(document.getElementById('id_component_users'));
            // console.log(document.getElementById('id_user_1'))
        },
        calcTotalPayment: function(payment_amount){
            this.totalPayment += payment_amount;
        }
    }
}
</script>