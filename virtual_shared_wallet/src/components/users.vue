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
                    @click="appendUser()"
                    large
                    color="primary"
                    dark
                >
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row id="id_users">
        </v-row>
    </v-container>
</template>

<script>
import Vue from 'vue';
import userInfo from './userInfo.vue';

export default {
    data: function(){
        return{
            appendedUserName: "",
            userNum: 1
        }
    },
    methods:{
        appendUser: function(){
            const div = document.createElement('div');
            div.innerHTML = '<div id="user_' + this.userNum + '"></div>';
            document.getElementById('id_users').appendChild(div);
            
            const userComponent = Vue.extend(userInfo);
            const instance = new userComponent({
                propsData: {
                    userName: this.appendedUserName
                }
            });
            instance.$mount("#user_" + this.userNum)
            // document.getElementById('user_' + this.userNum).appendChild(instance.$el)

            this.userNum++
            this.appendedUserName = ""
            // new Vue({
            //     render: h => h(userInfo, { props: { userName: this.appendedUserName } })
            // }).$mount('#id_users');
        }
    }
}
</script>