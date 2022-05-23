import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import type Session from 'ember-simple-auth/services/session';
import type Store from '@ember-data/store';

export default class AuthenticationController extends Controller {
  @service declare session: Session;
  @service declare store: Store;

  @tracked email?: string;
  @tracked password?: string;

  @tracked success?: true;
  @tracked error?: string;

  @action async register() {
    (this.success = undefined), (this.error = undefined);

    const { email, password } = this;
    try {
      await this.session.authenticate(
        'authenticator:supabase',
        async (auth) => {
          const credential = await auth.signUp({ email, password });

          if (credential.user) {
            const { id } = credential.user;
            await this.store
              .createRecord('user', {
                id,
                email,
              })
              .save();
          }

          return credential;
        }
      );
      this.success = true;
    } catch (error) {
      this.error = error.message;
    }
  }

  @action async login() {
    (this.success = undefined), (this.error = undefined);

    const { email, password } = this;
    try {
      await this.session.authenticate('authenticator:supabase', (auth) => {
        return auth.signIn({ email, password });
      });
      this.success = true;
    } catch (error) {
      this.error = error.message;
    }
  }

  @action async loginGitHub() {
    (this.success = undefined), (this.error = undefined);

    try {
      await this.session.authenticate('authenticator:supabase', (auth) => {
        return auth.signIn({
          provider: 'github',
        });
      });
      this.success = true;
    } catch (error) {
      this.error = error.message;
    }
  }

  @action logout() {
    return this.session.invalidate();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    authentication: AuthenticationController;
  }
}
