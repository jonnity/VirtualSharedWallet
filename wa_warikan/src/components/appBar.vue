<template>
    <div>
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
                <v-toolbar-title>和割勘</v-toolbar-title>
                <v-tabs v-if="!($vuetify.breakpoint.sm || $vuetify.breakpoint.xs)">
                    <v-tab
                        v-for="menuItem in menuList"
                        :key="menuItem.name"
                        :to="menuItem.url"
                    >
                        {{ menuItem.name }}
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
                            :key="menuItem.name"
                            :to="menuItem.url"
                        >
                            <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-navigation-drawer>
        </header>
        <div class="pa-6"></div>
        <router-view
            :userNameList="userNameList"
            @appendUserEvent="appendEvent"
            @repaymentEvent="repaymentEvent"
        ></router-view>
    </div>
</template>

<script>
export default ({
    name: "appBar",
    data(){
        return {
            drawer: false,
            menuList: [{
                name: "ユーザー追加",
                url: "/appendUserForm",
            },
            {
                name: "受け渡し",
                url: "/repaymentForm",
            },
            {
                name: "投げ銭",
                url: "/tippingForm",
            }],
        };
    },
    props: ["userNameList", "paymentList"],
    methods: {
        appendEvent: function(appendedUserName){
            this.$emit("appendUserEvent", appendedUserName);
        },
        repaymentEvent: function(repaymentInfo){
            this.$emit("repaymentEvent", repaymentInfo);
        }
    }
});
</script>

<style lang="scss" scoped>
.v-toolbar__title {
    overflow: visible !important;
    margin-right: 50px !important;
}
</style>
