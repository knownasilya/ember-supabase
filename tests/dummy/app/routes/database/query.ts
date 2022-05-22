import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type Store from '@ember-data/store';
import type PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/lib/PostgrestFilterBuilder';

export default class DatabaseQueryRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.query('post', {
      realtime: true,
      include: 'user,comments',
      filter: (ref: PostgrestFilterBuilder<any>) => {
        return ref
          .order('created_at', {
            ascending: false,
          })
          .limit(50);
      },
    });
  }
}
