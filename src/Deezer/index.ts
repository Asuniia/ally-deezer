import type { AllyUserContract, ApiRequestContract } from '@ioc:Adonis/Addons/Ally'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type {
  DeezerAccessToken,
  DeezerConfig,
  DeezerScopes,
  UserFields,
  UserFieldsAndToken,
  UserInfo,
} from './types'
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone'

export class Deezer extends Oauth2Driver<DeezerAccessToken, DeezerScopes> {

  protected authorizeUrl = 'https://connect.deezer.com/oauth/auth.php'
  protected accessTokenUrl = 'https://connect.deezer.com/oauth/access_token.php'
  protected userInfoUrl = 'https://api.deezer.com/user/me'
  protected codeParamName = 'code'
  protected errorParamName = 'error_reason'
  protected stateCookieName = 'deezer_oauth_state'
  protected stateParamName = 'state'
  protected scopeParamName = 'perms'
  protected scopesSeparator = ','

  constructor(ctx: HttpContextContract, public config: DeezerConfig) {
    super(ctx, config)

    config.scopes = config.scopes || ['basic_access','email','offline_access','manage_library','delete_library','listening_history','manage_community']
  
    this.loadState()
    this.stateless()
  }


  protected configureRedirectRequest(request: RedirectRequest<DeezerScopes>): void {
    request.scopes(this.config.scopes || ['basic_access','email','offline_access','manage_library','delete_library','listening_history','manage_community'])

    request.param('app_id', this.config.clientId)
    request.param('response_type', 'code')
    request.param('response_mode', 'query')
  }

  public accessDenied(): boolean {
    return this.ctx.request.input('error') === 'invalid_grant'
  }

  protected configureAccessTokenRequest(request: ApiRequest) {
    request.param('app_id', this.config.clientId)
    request.param('secret', this.config.clientSecret)
    request.param('code', this.ctx.request.input('code'))
    request.param('output', 'json')
  }

  protected getAuthenticatedRequest(url: string, token: string): ApiRequest {
    const request = this.httpClient(url)
    request.param('access_token', `${token}`)
    request.parseAs('json')
    return request
  }

  protected async getUserInfo(
    token: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<UserFields> {
    const userRequest = this.getAuthenticatedRequest(
      this.config.userInfoUrl || this.userInfoUrl,
      token
    )
    if (typeof callback === 'function') {
      callback(userRequest)
    }

    const userBody: UserInfo = await userRequest.get()

    return {
      id: userBody.id,
      nickName: userBody.name,
      displayName: userBody.name,
      avatarUrl: null,
      name: userBody.name,
      email: userBody.email ? (userBody.email as string) : (null as null),
      emailVerificationState: 'unsupported' as const,
      original: userBody,
    }
  }

  protected processClientResponse(client: ApiRequest, response: any): any {
    if (client.responseType === 'json') {
      return response
    }
  }

  public async user(
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<DeezerAccessToken>> {
    const accessToken = await this.accessToken()
    const user: UserFields = await this.getUserInfo(accessToken.token, callback)

    return {
      ...user,
      token: {
        token: accessToken.token,
        type: 'bearer'
      },
    }
  }

  public async userFromToken(token: string): Promise<UserFieldsAndToken> {
    const user: UserFields = await this.getUserInfo(token)

    return {
      ...user,
      token: { token, type: 'bearer' as const },
    }
  }
}