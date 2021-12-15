import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service declare session: any;

  @action login(): void {
    function _TODO_(email: string, password: string): any {}
    this.session.authenticate('authenticator:supabase', (auth: any) => {
      return _TODO_('me@example.com', 'password');
    })
  }

  @action logout(): void {
    this.session.invalidate();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'application': ApplicationController;
  }
}
