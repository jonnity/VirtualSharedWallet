<template>
    <v-app-bar
        fixed
        color="orange"
        elevate-on-scroll
    >
        <v-toolbar-title>VirtualSharedWallet</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
export default ({
    name: "appBar",
    data: function(){
        return {};
    },
})
</script>

