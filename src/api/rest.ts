import axios from 'axios';
import OauthClient from '@girder/oauth-client';

export const axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_API_ROOT}api`,
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
}

axiosInstance.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...oauthClient?.authHeaders,
    ...config.headers,
  },
}));
export async function rgdSearch(
  limit?: number,
  offset?: number,
  q?: string,
  predicate?: string | null,
  acquiredAfter?: string | null,
  acquiredBefore?: string | null,

) {
  const response = await axiosInstance.get('rgd/search', {
    params: {
      limit,
      offset,
      q,
      predicate,
      acquiredAfter,
      acquiredBefore,
    },
  });
  return response;
}

export async function rgdFootprint(
  spatialID: number,
) {
  const response = await axiosInstance.get(`rgd/spatial_entry/${spatialID}/footprint`);

  return response;
}
