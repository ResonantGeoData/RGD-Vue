import axios from 'axios';
import Vue from 'vue';
import OauthClient from '@girder/oauth-client';

export const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
});
export const oauthClient = new OauthClient(
  process.env.VUE_APP_OAUTH_API_ROOT,
  process.env.VUE_APP_OAUTH_CLIENT_ID,
);

export async function restoreLogin() {
  if (!oauthClient) {
    return;
  }
  await oauthClient.maybeRestoreLogin();
  // .then(async () => {
  //   Object.assign(axiosInstance.defaults.headers.common, oauthClient.authHeaders);
  // });
  // if (!oauthClient.isLoggedIn) {

  // }
}

axiosInstance.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...oauthClient?.authHeaders,
    ...config.headers,
  },
}));
// .then
//   async () => {
//     Object.assign(axiosInstance.defaults.headers.common, oauthClient.authHeaders);
//   },
// );

export async function test() {
  const data = await axiosInstance.get('rgd/search');
  console.log(data);
}
