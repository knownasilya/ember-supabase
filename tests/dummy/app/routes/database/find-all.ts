import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type Store from '@ember-data/store';

export default class DatabaseFindAllRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.findAll('post');
  }
}
