The package has been configured successfully.

Make sure to first define the mapping inside the `contracts/ally.ts` file as follows.

```ts
declare module '@ioc:Adonis/Addons/Ally' {
  import { DeezerDriver, DeezerDriverConfig } from 'ally-deezer/build/standalone'

  interface SocialProviders {
    // ... other mappings
    deezer: {
      config: DeezerDriverConfig
      implementation: DeezerDriver
    }
  }
}
```

Ally config relies on environment variables for the client id and secret. We recommend you to validate environment variables inside the `env.ts` file.

## Variables for Deezer driver

```ts
DEEZER_CLIENT_ID: Env.schema.string(),
DEEZER_CLIENT_SECRET: Env.schema.string(),
```

## Ally config for Deezer driver

```ts
const allyConfig: AllyConfig = {
  // ... other drivers
  deezer: {
    driver: 'Deezer',
    clientId: Env.get('DEEZER_CLIENT_ID'),
    clientSecret: Env.get('DEEZER_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/deezer/callback',
  },
}
```