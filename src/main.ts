import * as Sentry from '@sentry/vue';
import Vue from 'vue';
import '@/plugins/composition';
import Clipboard from 'v-clipboard';
import Cesium from './plugins/cesium';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { restoreLogin, oauthClient, axiosInstance } from './api/rest';

// Set token to `null` to avoid warning
Cesium.Ion.defaultAccessToken = null;

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
});
async function login() {
  return restoreLogin();
}

Vue.use(Clipboard);

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
