import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type Store from '@ember-data/store';

export default class DatabaseCreateRecordController extends Controller {
  @service declare store: Store;

  @tracked title?: string;
  @tracked body?: string;

  @tracked success?: true;
  @tracked error?: string;

  @action async create() {
    (this.success = undefined), (this.error = undefined);

    const user = this.store.peekRecord('user', '1');
    const { title, body } = this;
    const post = this.store.createRecord('post', { user, title, body });

    try {
      await post.save();
      (this.success = true), (this.title = undefined), (this.body = undefined);
    } catch (error) {
      this.error = error.message;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'database/create-record': DatabaseCreateRecordController;
  }
}
