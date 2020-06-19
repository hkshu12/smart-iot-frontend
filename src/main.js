import Vue from 'vue';
import '@/plugins/ant-design-vue';
import '@/plugins/axios';
import TimeFormater from '@/utils/timeFormater';
import App from '@/App.vue';
import router from '@/router';

Vue.config.productionTip = false;

Vue.use(TimeFormater);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
