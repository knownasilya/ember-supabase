declare module 'ember-simple-auth/authenticators/base' {
  import EmberObject from '@ember/object';

  export default class BaseAuthenticator extends EmberObject {
    authenticate(...args: unknown[]): Promise<unknown>;
    invalidate(
      data?: Record<string, unknown>,
      ...args: unknown[]
    ): Promise<unknown>;
    restore(data: Record<string, unknown>): Promise<unknown>;
  }
}
