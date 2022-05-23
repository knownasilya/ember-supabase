import RESTSerializer from '@ember-data/serializer/rest';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

import type Store from '@ember-data/store';
import type Model from '@ember-data/model';
import type ModelRegistry from 'ember-data/types/registries/model';

type ModelClass = Model & {
  modelName: keyof ModelRegistry;
};

type RelationshipValue = string | { id: string } | { id: string }[] | null;

export default class SupabaseSerializer extends RESTSerializer {
  public keyForAttribute(key: string): string {
    return underscore(key);
  }

  public extractRelationships(
    modelClass: Model,
    resourceHash: Record<string, unknown>
  ): Record<string, unknown> {
    const links: Record<string, string> = {};

    modelClass.eachRelationship((name, { kind, type }) => {
      if (kind === 'belongsTo') {
        const id = resourceHash[name];
        if (id) {
          links[name] = `${type}/${id}`;
        }
      } else if (kind === 'hasMany') {
        links[name] = type;
      }
    });

    resourceHash.links = links;

    return super.extractRelationships(modelClass, resourceHash);
  }

  public normalizeResponse(
    store: Store,
    primaryModelClass: ModelClass,
    payload: Record<string, unknown>,
    id: string | number,
    requestType: string
  ): Record<string, unknown> {
    const type = pluralize(primaryModelClass.modelName);
    const newPayload = {
      [type]: payload,
    };

    return super.normalizeResponse(
      store,
      primaryModelClass,
      newPayload,
      id,
      requestType
    );
  }

  public normalizeSingleResponse(
    store: Store,
    primaryModelClass: ModelClass,
    payload: Record<string, Record<string, unknown>>,
    id: string,
    requestType: string
  ): Record<string, unknown> {
    const record = payload[pluralize(primaryModelClass.modelName)];
    this.appendIncludedRecordsToPayload(primaryModelClass, payload, record);

    return super.normalizeSingleResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }

  public normalizeArrayResponse(
    store: Store,
    primaryModelClass: ModelClass,
    payload: Record<string, []>,
    id: string,
    requestType: string
  ): Record<string, unknown> {
    const records = payload[pluralize(primaryModelClass.modelName)];
    records.forEach((record) => {
      this.appendIncludedRecordsToPayload(primaryModelClass, payload, record);
    });

    return super.normalizeArrayResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }

  /**
   * Brings nested records up to top level for sideloading.
   * @param primaryModelClass
   * @param payload
   * @param record
   */
  private appendIncludedRecordsToPayload(
    primaryModelClass: ModelClass,
    payload: Record<string, Record<string, any> | Record<string, unknown>[]>,
    record: Record<string, unknown>
  ): void {
    primaryModelClass.eachRelationship((name, { kind, type }) => {
      const value = record[name] as RelationshipValue;
      if (value && typeof value === 'object') {
        const includedType = pluralize(type);
        if (!Array.isArray(payload[includedType])) {
          payload[includedType] = [];
        }
        if (kind === 'belongsTo' && !Array.isArray(value)) {
          payload[includedType].push(value);
          record[name] = value.id;
        } else if (kind === 'hasMany' && Array.isArray(value)) {
          payload[includedType].push(...value);
          record[name] = value.map((record) => record.id);
        }
      }
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    supabase: SupabaseSerializer;
  }
}
