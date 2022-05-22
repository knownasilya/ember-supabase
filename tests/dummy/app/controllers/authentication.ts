import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import type Session from 'ember-simple-auth/services/session';

export default class AuthenticationController extends Controller {
  @service declare session: Session;

  @tracked email?: string;
  @tracked password?: string;

  @tracked success?: true;
  @tracked error?: string;

  @action async register() {
    (this.success = undefined), (this.error = undefined);

    const { email, password } = this;
    try {
      await this.session.authenticate('authenticator:supabase', (auth) => {
        return auth.signUp({ email, password });
      });
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
