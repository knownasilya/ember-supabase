import Route from '@ember/routing/route';

import type PostgrestFilterBuilder from '@supabase/postgrest-js/dist/main/lib/PostgrestFilterBuilder';

export default class DatabaseRoute extends Route {
  model() {
    return this.store.query('post', {
      filter(ref: PostgrestFilterBuilder<any>) {
        return ref.order('created_at', { ascending: false });
      },
    });
  }
}
