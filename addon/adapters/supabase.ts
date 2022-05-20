import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { pluralize } from 'ember-inflector';

import type SupabaseService from 'ember-supabase/services/supabase';
import type Store from '@ember-data/store';
import type ModelRegistry from 'ember-data/types/registries/model';
import type DS from 'ember-data';
import type { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder';
import type PostgrestFilterBuilder from '@supabase/postgrest-js/dist/main/lib/PostgrestFilterBuilder';

type ModelClass = any;

interface Query {
  include?: string;
  filter?: (ref: PostgrestFilterBuilder<any>) => PostgrestFilterBuilder<any>;
}

export default class SupabaseAdapter extends JSONAPIAdapter {
  @service protected declare supabase: SupabaseService;

  public createRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const serialized = this.serialize(snapshot, { includeId: true });
        const ref = this.buildRef(type.modelName);
        const { data, error } = await ref.insert(serialized).single();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public updateRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const serialized = this.serialize(snapshot, { includeId: true });
        const ref = this.buildRef(type.modelName);
        const { data, error } = await ref
          .update(serialized)
          .match({ id: snapshot.id })
          .single();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public deleteRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(type.modelName);
        const { data, error } = await ref
          .delete()
          .match({ id: snapshot.id })
          .single();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public findRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    id: string,
    _snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(type.modelName);
        const { data, error } = await ref.select().match({ id }).single();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public findAll(
    _store: Store,
    type: ModelClass,
    _sinceToken: string,
    _snapshotRecordArray: any
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(type.modelName);
        const { data, error } = await ref.select();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public findBelongsTo<K extends keyof ModelRegistry>(
    _store: Store,
    _snapshot: DS.Snapshot<K>,
    url: string
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const [type, id] = url.split('/');
        const ref = this.buildRef(type);
        const { data, error } = await ref.select().match({ id }).single();
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public findHasMany(
    _store: Store,
    snapshot: any,
    _url: string,
    relationship: any
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(relationship.type);
        const { data, error } = await ref
          .select()
          .eq(relationship.__inverseKey, snapshot.id);
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public query<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelRegistry[K],
    query: Query
  ): RSVP.Promise<any> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef((type as ModelClass).modelName);
        let columns;
        if (query.include) {
          const relationships = query.include.split(',');
          columns = [
            '*',
            ...relationships.map((relationship) => `${relationship} (*)`),
          ].join(',');
        }
        const selectRef = ref.select(columns);
        const queryRef = query.filter?.(selectRef) || selectRef;
        const { data, error } = await queryRef;
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  protected buildRef(modelName: string): SupabaseQueryBuilder<any> {
    return this.supabase.client.from(pluralize(modelName));
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    supabase: SupabaseAdapter;
  }
}
