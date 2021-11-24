# RGD-Vue

[![CI](https://github.com/ResonantGeoData/RGD-Vue/actions/workflows/main.yml/badge.svg)](https://github.com/ResonantGeoData/RGD-Vue/actions/workflows/main.yml)

## Building
* Set the envornment variables in a `.env.development.local` file:
  * `VUE_APP_OAUTH_CLIENT_ID`: A new OAuth2 public client ID, from an instance of `RD-OpenGeo`.
  * `VUE_APP_CESIUM_ACCESS_TOKEN`: A 
    [Cesium ion access token](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/#step-1-create-an-account-and-get-a-token).
* `yarn`
* `yarn serve`
