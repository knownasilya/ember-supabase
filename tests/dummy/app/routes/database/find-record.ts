import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

import type Store from '@ember-data/store';

export default class DatabaseFindRecordRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      user: this.store.findRecord(
        'user',
        'e5383a22-d410-4614-89a1-20ea900fa6c1',
        {
          include: 'comments',
        }
      ),
      post: this.store.findRecord('post', 1, {
        include: 'user,comments',
      }),
      comment: this.store.findRecord('comment', 1, {
        include: 'user,post',
      }),
    });
  }
}
