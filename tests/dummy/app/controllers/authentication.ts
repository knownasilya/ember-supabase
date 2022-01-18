import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import type Session from 'ember-simple-auth/services/session';

export default class AuthenticationController extends Controller {
  @service declare session: Session;

  @tracked email?: string;
  @tracked password?: string;
  @tracked error?: string;

  @action async register(): Promise<void> {
    const { email, password } = this;
    try {
      await this.session.authenticate('authenticator:supabase', (auth) => {
        return auth.signUp({ email, password });
      });
    } catch (error) {
      this.error = error.message;
    }
  }

  @action async login(): Promise<void> {
    const { email, password } = this;
    try {
      await this.session.authenticate('authenticator:supabase', (auth) => {
        return auth.signIn({ email, password });
      });
    } catch (error) {
      this.error = error.message;
    }
  }

  @action loginGitHub(): void {
    this.session.authenticate('authenticator:supabase', (auth) => {
      return auth.signIn({
        provider: 'github',
      });
    });
  }

  @action logout(): Promise<void> {
    return this.session.invalidate();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    authentication: AuthenticationController;
  }
}
