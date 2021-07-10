import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
    // Vue.use(vuetify)

// new vuetify({
//     icons: {
//         iconfont: 'mdi', // default - only for display purposes
//     },
// }).$mount('#app')

new Vue({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
    vuetify,
    render: h => h(App)
}).$mount('#app')