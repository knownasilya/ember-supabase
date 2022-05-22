import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

import type Store from '@ember-data/store';

export default class DatabaseFindRecordRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      user: this.store.findRecord('user', 1, {
        include: 'comments',
      }),
      post: this.store.findRecord('post', 58, {
        include: 'user,comments',
      }),
      comment: this.store.findRecord('comment', 1, {
        include: 'user,post',
      }),
    });
  }
}
