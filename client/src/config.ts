// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bz9c0j8ryg'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'mz-dev.eu.auth0.com', // Auth0 domain
  clientId: 'VpamZyI8WklXhu1N3oPJryhtVkp5lGHB', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
