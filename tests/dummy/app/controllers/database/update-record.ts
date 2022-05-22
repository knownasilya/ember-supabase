import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type Store from '@ember-data/store';
import type PostModel from '../../models/post';

export default class DatabaseUpdateRecordController extends Controller {
  declare model: PostModel;

  @service declare store: Store;

  @tracked success?: true;
  @tracked error?: string;

  @action async update() {
    (this.success = undefined), (this.error = undefined);
    try {
      await this.model.save();
      this.success = true;
    } catch (error) {
      this.error = error.message;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'database/update-record': DatabaseUpdateRecordController;
  }
}
