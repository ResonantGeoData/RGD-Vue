# RGD-Vue

[![CI](https://github.com/ResonantGeoData/RGD-Vue/actions/workflows/main.yml/badge.svg)](https://github.com/ResonantGeoData/RGD-Vue/actions/workflows/main.yml)

Visit our production instance at: https://gui.resonantgeodata.com/

## Building the Development Environment
### Requirements
* an instance of [ResonantGeoData](https://github.com/ResonantGeoData/ResonantGeoData) (RGD)
* npm/nodejs
* [yarn (npm package)](https://yarnpkg.com/)
### Building
* Build an instance of RGD according to the [developer documentation](https://github.com/ResonantGeoData/ResonantGeoData/blob/main/DEVELOPMENT.md)
* In your RGD instance, navigate to the Admin Area, scroll to "Applications" and create new
* The settings for your new application should match as follows:
  * Redirect URLs: http://localhost:8080/ (trailing slash matters)
  * Client type: Public
  * Authorization grant type: Authorization code
  * Client Secret: empty
  * Name: A descriptive name of your choosing

![image](https://user-images.githubusercontent.com/72574166/149992340-7d02c736-4c3c-4b9e-930d-2cf1f4de262c.png)

* Create a new file `.env.development.local` in your RGD-Vue directory to house environent variables:
  * Set `VUE_APP_OAUTH_CLIENT_ID` to the value found in your application's "Client ID" field. This value represents a new OAuth2 public client ID.


With these values set, you can run the development server on port 8080 by running:
 `yarn`
 `yarn serve`

At any time that you wish to launch RGD-Vue, you MUST have an instance of RGD running beforehand.
