import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient';

export default class ApplicationController extends Controller {
  @service declare session: any;

  @action login(): void {
    this.session.authenticate(
      'authenticator:supabase',
      (auth: SupabaseAuthClient) => {
        return auth.signIn({
          email: 'example@email.com',
          password: 'example-password',
        });
      }
    );
  }

  @action logout(): void {
    this.session.invalidate();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: ApplicationController;
  }
}
