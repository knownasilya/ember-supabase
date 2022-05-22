import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { pluralize } from 'ember-inflector';

import type SupabaseService from 'ember-supabase/services/supabase';
import type Store from '@ember-data/store';
import type ModelRegistry from 'ember-data/types/registries/model';
import type DS from 'ember-data';
import type { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder';
import type PostgrestFilterBuilder from '@supabase/postgrest-js/dist/module/lib/PostgrestFilterBuilder';

type ModelClass<K extends keyof ModelRegistry> = ModelRegistry[K] & {
  modelName: string;
};

interface Query {
  include?: string;
  filter?: (ref: PostgrestFilterBuilder<any>) => PostgrestFilterBuilder<any>;
}

export default class SupabaseAdapter extends RESTAdapter {
  @service protected declare supabase: SupabaseService;

  public createRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass<K>,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<unknown> {
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
    type: ModelClass<K>,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<unknown> {
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
    type: ModelClass<K>,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<unknown> {
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
    type: ModelClass<K>,
    id: string,
    snapshot: DS.Snapshot<K> & Query
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(type.modelName);
        let columns;
        if (snapshot.include) {
          columns = this.serializeColumns(snapshot.include);
        }
        const { data, error } = await ref
          .select(columns)
          .match({ id })
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

  public findAll<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass<K>
  ): RSVP.Promise<unknown> {
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

  public query<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass<K>,
    query: Query
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const ref = this.buildRef(type.modelName);
        let columns;
        if (query.include) {
          columns = this.serializeColumns(query.include);
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

  public findHasMany<K extends keyof ModelRegistry>(
    store: Store,
    snapshot: DS.Snapshot<K>,
    _url: string,
    relationship: any
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise(async (resolve, reject) => {
      try {
        const inverse = (
          snapshot.type as unknown as typeof DS.Model
        ).inverseFor(relationship.key, store) as { name: string };
        const ref = this.buildRef(relationship.type);
        const { data, error } = await ref
          .select()
          .eq(inverse.name, snapshot.id);
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

  /**
   * Returns Supabase database reference.
   * @param modelName
   * @returns
   */
  protected buildRef(modelName: string): SupabaseQueryBuilder<any> {
    return this.supabase.client.from(pluralize(modelName));
  }

  /**
   * Transforms `include` string for sideloading.
   * @param include
   * @returns
   */
  protected serializeColumns(include: string): string {
    const relationships = include.split(',');
    return [
      '*',
      ...relationships.map((relationship) => `${relationship} (*)`),
    ].join(',');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    supabase: SupabaseAdapter;
  }
}
