import * as Sentry from '@sentry/vue';
import Vue from 'vue';
import '@/plugins/composition';
// import DatetimePicker from 'vuetify-datetime-picker';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { restoreLogin, oauthClient, axiosInstance } from './api/rest';

// Vue.use(DatetimePicker);


Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
});
async function login() {
  return restoreLogin();
}

login().then(() => {
  new Vue({
    provide: {
      axios: axiosInstance,
      oauthClient,
    },
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
});
