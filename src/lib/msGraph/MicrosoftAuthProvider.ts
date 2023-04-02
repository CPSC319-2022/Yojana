import { AuthenticationProvider } from '@microsoft/microsoft-graph-client'

/**
 * This class implements the AuthenticationProvider interface to provide an access token to the Microsoft Graph client.
 * @see https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/HEAD/docs/CreatingClientInstance.md
 */
export class MicrosoftAuthProvider implements AuthenticationProvider {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getAccessToken(): Promise<string> {
    return this.accessToken
  }
}
