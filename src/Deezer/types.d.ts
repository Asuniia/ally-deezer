import type { LiteralStringUnion } from '@ioc:Adonis/Addons/Ally'

export type DeezerAccessToken = {
  token: string
  type: 'bearer'
}

export type DeezerScopes = string

export type DeezerConfig = {
  driver: 'DeezerAuth'
  clientId: string
  clientSecret: string
  callbackUrl: string
  userInfoUrl?: string
  scopes?: LiteralStringUnion<DeezerScopes>[]
}

export type UserInfo = {
  'id': string
  'name': string
  'lastname': string
  'firstname': string
  'email': string
  'original': UserInfo
}

export type UserFields = {
  id: string
  avatarUrl: string | null
  nickName: string
  displayName?: string | undefined
  name: string
  email: string | null
  emailVerificationState: 'verified' | 'unverified' | 'unsupported'
  original: UserInfo | null
}

export interface UserFieldsAndToken extends UserFields {
  token: {
    token: string
    type: const
  }
}