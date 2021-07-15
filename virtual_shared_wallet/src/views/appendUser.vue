<template>
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
</template>

<script>
export default({
    name: "appendUser",
    data: function(){
        
    },
})
</script>
