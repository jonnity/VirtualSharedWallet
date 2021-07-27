<template>
    <v-container>
        <v-row align="center">
            <v-col>
                <userTextField
                    v-model="inputtedUserName"
                ></userTextField>
            </v-col>
            <v-col>
                <v-btn
                    @click="formatNameAndEmitEvent"
                    :disabled="inputtedUserName===''"
                    large
                    color="primary"
                >
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import userTextField from "../components/userTextField.vue"

export default {
    name: "appendUserForm",
    components: {
        userTextField,
    },
    props: ["userNameList"],
    data: function () {
        return {
            inputtedUserName: "",
        };
    },
    methods: {
        formatNameAndEmitEvent: function(){
            let appendedUserName = this.inputtedUserName;
            const sameNameReg = new RegExp("/"+this.inputtedUserName+"_\\d/");
            const sameNames = this.userNameList.filter(function(name){return name.match(sameNameReg) != [];});
            const sameNameMenberNum = sameNames.length;
            if(sameNameMenberNum > 0){
                appendedUserName = this.inputtedUserName + "_" + (sameNameMenberNum+1); 
            }

            this.$emit("appendUserEvent", appendedUserName);

            this.inputtedUserName = "";
        },
    },
};
</script>

<style scoped>
</style>
