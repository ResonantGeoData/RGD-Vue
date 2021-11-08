import axios from 'axios';
import OauthClient from '@girder/oauth-client';
import * as Sentry from '@sentry/vue';
import Vue from 'vue';
import '@/plugins/composition';
import Cesium from './plugins/cesium';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { restoreLogin, oauthClient, axiosInstance } from './api/rest';

Cesium.Ion.defaultAccessToken = process.env.VUE_APP_CESIUM_ACCESS_TOKEN;

// const axiosInstance = axios.create({
//   baseURL: process.env.VUE_APP_API_ROOT,
// });

// const oauthClient = new OauthClient(
//   process.env.VUE_APP_OAUTH_API_ROOT,
//   process.env.VUE_APP_OAUTH_CLIENT_ID,
// );

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
