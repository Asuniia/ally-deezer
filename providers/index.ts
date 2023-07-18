import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class YourDriverProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { Deezer } = await import('../src/Deezer')

    Ally.extend('Deezer', (_, __, config, ctx) => {
      return new Deezer(ctx, config)
    })
  }
}
