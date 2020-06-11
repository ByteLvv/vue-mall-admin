// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import MyBread from './components/cuscom/myBread.vue'
import MyHttpServer from '../src/plugins/http.js'
import moment from 'moment'

// 引入css文件
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/reset.css'

import router from './router'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器-处理日期
Vue.filter('fmtdate', (v) => {
    return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component('my-bread', MyBread)

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})