import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type Store from '@ember-data/store';

export default class DatabaseController extends Controller {
  @service declare store: Store;

  @tracked title?: string;
  @tracked body?: string;

  @tracked error?: string;

  @action async create(): Promise<void> {
    const { title, body } = this;
    try {
      await this.store.createRecord('post', { title, body }).save();
      (this.title = undefined), (this.body = undefined);
    } catch (error) {
      this.error = error.message;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    database: DatabaseController;
  }
}
