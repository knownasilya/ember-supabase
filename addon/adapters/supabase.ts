import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { pluralize } from 'ember-inflector';

import type SupabaseService from 'ember-supabase/services/supabase';
import type Store from '@ember-data/store';
import type ModelRegistry from 'ember-data/types/registries/model';
import type DS from 'ember-data';

type ModelClass = any;

export default class SupabaseAdapter extends JSONAPIAdapter {
  @service declare supabase: SupabaseService;

  createRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      const serialized = this.serialize(snapshot, { includeId: true });
      this.supabase.client
        .from(pluralize(type.modelName))
        .insert([serialized])
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data![0]);
          }
        });
    });
  }

  updateRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      const serialized = this.serialize(snapshot, { includeId: true });
      this.supabase.client
        .from(pluralize(type.modelName))
        .update([serialized])
        .match({ id: snapshot.id })
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data![0]);
          }
        });
    });
  }

  deleteRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.supabase.client
        .from(pluralize(type.modelName))
        .delete()
        .match({ id: snapshot.id })
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
    });
  }

  findRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelClass,
    id: string,
    _snapshot: DS.Snapshot<K>
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.supabase.client
        .from(pluralize(type.modelName))
        .select()
        .match({ id })
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data![0]);
          }
        });
    });
  }

  findAll(
    _store: Store,
    type: ModelClass,
    _sinceToken: string,
    _snapshotRecordArray: any
  ): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.supabase.client
        .from(pluralize(type.modelName))
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
