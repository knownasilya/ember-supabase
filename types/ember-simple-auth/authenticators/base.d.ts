declare module 'ember-simple-auth/authenticators/base' {
  import EmberObject from '@ember/object';

  export default class BaseAuthenticator extends EmberObject {
    authenticate(...args: any[]): Promise<unknown>;
    invalidate(data?: object, ...args: any[]): Promise<unknown>;
    restore(data: object): Promise<unknown>;
  }
}
