import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { pluralize } from 'ember-inflector';

import type SupabaseService from 'ember-supabase/services/supabase';
// @ts-ignore
import type Store from '@ember-data/store';
import type ModelRegistry from 'ember-data/types/registries/model';

export default class SupabaseAdapter extends JSONAPIAdapter {
  @service declare supabase: SupabaseService;

  findAll<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelRegistry[K],
    _sinceToken: string,
    _snapshotRecordArray: any
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.supabase.client
        .from(pluralize((type as any).modelName))
        .select()
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    supabase: SupabaseAdapter;
  }
}
