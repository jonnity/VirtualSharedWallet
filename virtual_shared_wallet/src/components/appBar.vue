<template>
    <header>
        <v-app-bar
            app
            fixed
            color="orange"
            elevate-on-scroll
        >
            <v-app-bar-nav-icon 
                @click="drawer = true"
                v-if="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>VirtualSharedWallet</v-toolbar-title>
            <v-tabs v-if="!($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)">
                <v-tab
                    v-for="menuItem in menuList"
                    :key="menuItem"
                >
                    {{ menuItem }}
                </v-tab>
            </v-tabs>

            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            fixed
            temporary
        >
            <v-list
                nav
                dense
            >
                <v-list-item-group>
                    <v-list-item
                        v-for="menuItem in menuList"
                        :key="menuItem"
                    >
                        <v-list-item-title>{{ menuItem }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </header>
</template>

<script>
export default ({
    name: "appBar",
    data(){
        return {
            drawer: false,
            menuList: [
                "ユーザー追加",
                "受け渡し",
                "投げ銭",
            ],
        };
    },
});
</script>

<style lang="scss" scoped>
.v-toolbar__title {
    overflow: visible !important;
    margin-right: 50px !important;
}
</style>
