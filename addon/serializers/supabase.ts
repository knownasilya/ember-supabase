import JSONAPISerializer from '@ember-data/serializer/json-api';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

import type Store from '@ember-data/store';

import type Model from '@ember-data/model';
import type DS from 'ember-data';

interface UglyPayload {
  id: string;
  [key: string]: unknown;
}

interface UglyDocumentHash {
  data: UglyPayload | UglyPayload[];
  included: unknown[];
}

interface DocumentHash {
  data: ResourceHash | ResourceHash[];
  errors?: ErrorHash[];
  meta?: MetaHash;
  jsonapi?: Record<string, unknown>;
  links?: LinksHash;
  included?: ResourceHash[];
}

interface ResourceHash {
  type: string;
  id: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, RelationshipHash>;
  links?: LinksHash;
}

interface RelationshipHash {
  links?: LinksHash;
  data?: ResourceLink;
  meta?: MetaHash;
}

interface LinkHash {
  href: string;
  meta: MetaHash;
}
type Link = string | LinkHash;
type SelfLink = { self: Link };
type RelatedLink = { related: Link };

type LinksHash = SelfLink | RelatedLink;

type ErrorHash = Record<string, unknown>;
type MetaHash = Record<string, unknown>;

interface ResourceIdentifier {
  type: string;
  id: string;
  meta?: MetaHash;
}

type ResourceLink = null | ResourceIdentifier | ResourceIdentifier[];

interface ModelClass {
  modelName: string;
  determineRelationshipType(
    descriptor: { kind: string; type: string },
    store: Store
  ): string;
  eachRelationship(
    callback: (
      name: string,
      descriptor: {
        kind: string;
        type: string;
      }
    ) => void
  ): void;
}

export default class SupabaseSerializer extends JSONAPISerializer {
  public keyForAttribute(key: string): string {
    return underscore(key);
  }

  public extractRelationships(
    modelClass: ModelClass,
    resourceHash: ResourceHash
  ): {} {
    const relationships: Record<string, RelationshipHash> = {};

    modelClass.eachRelationship((name, { kind, type }) => {
      if (kind === 'belongsTo') {
        const value = resourceHash.attributes?.[name] as
          | UglyPayload
          | string
          | null;
        if (value) {
          const id = typeof value === 'object' ? value.id : value;
          relationships[name] = {
            data: {
              type,
              id,
            },
            links: {
              related: `${type}/${value}`,
            },
          };
        }
      } else {
        const arr = resourceHash.attributes?.[name] as UglyPayload[];
        relationships[name] = {
          links: {
            related: type,
          },
        };
        if (arr) {
          relationships[name].data = arr.map(({ id }) => ({
            type,
            id,
          }));
        }
      }
    });

    resourceHash.relationships = relationships;

    return super.extractRelationships(modelClass, resourceHash);
  }

  public normalizeSingleResponse(
    store: Store,
    primaryModelClass: ModelClass & Model,
    payload: UglyDocumentHash & { data: UglyPayload },
    _id: string,
    requestType: string
  ): Record<string, unknown> {
    const type = pluralize(primaryModelClass.modelName);
    const { id, ...attributes } = payload.data;
    const newPayload: DocumentHash = {
      data: {
        type,
        id,
        attributes,
      },
      included: this.gatherIncluded(primaryModelClass, payload.data),
    };

    return super.normalizeSingleResponse(
      store,
      primaryModelClass,
      newPayload,
      _id,
      requestType
    );
  }

  public normalizeArrayResponse(
    store: Store,
    primaryModelClass: ModelClass & Model,
    payload: UglyDocumentHash & { data: UglyPayload[] },
    _id: string,
    requestType: string
  ): Record<string, unknown> {
    const type = pluralize(primaryModelClass.modelName);
    const newPayload: DocumentHash = {
      data: [],
      included: payload.data
        .map((thing) => this.gatherIncluded(primaryModelClass, thing))
        .flat(),
    };
    newPayload.data = payload.data.map(
      ({ id, ...attributes }): ResourceHash => ({
        type,
        id,
        attributes,
      })
    );

    return super.normalizeArrayResponse(
      store,
      primaryModelClass,
      newPayload,
      _id,
      requestType
    );
  }

  public normalizeResponse(
    store: Store,
    primaryModelClass: ModelClass & Model,
    payload: UglyPayload | UglyPayload[],
    id: string | number,
    requestType: string
  ): DocumentHash {
    const newPayload = {
      data: payload,
    };

    return super.normalizeResponse(
      store,
      primaryModelClass,
      newPayload,
      id,
      requestType
    ) as DocumentHash;
  }

  private gatherIncluded(
    primaryModelClass: ModelClass & Model,
    record: UglyPayload
  ): ResourceHash[] {
    let included: ResourceHash[] = [];

    primaryModelClass.eachRelationship((name, { kind, type }) => {
      if (kind === 'belongsTo') {
        const value = record[name] as UglyPayload | string | null;
        if (value && typeof value === 'object') {
          const { id, ...attributes } = value;
          included.push({
            type,
            id,
            attributes,
          });
        }
      } else {
        const arr = record[name] as UglyPayload[];
        if (arr) {
          included = included.concat(
            arr.map(
              ({ id, ...attributes }): ResourceHash => ({
                type,
                id,
                attributes,
              })
            )
          );
        }
      }
    });

    return included;
  }

  serialize(snapshot: DS.Snapshot, options: any) {
    const json: Record<string, unknown> = {};

    if (options && options.includeId) {
      const id = snapshot.id;
      if (id) {
        json[this.primaryKey] = id;
      }
    }

    snapshot.eachAttribute((key, _attribute) => {
      json[underscore(key)] = snapshot.record[key];
    });

    snapshot.eachRelationship((_key, relationship) => {
      if (relationship.kind === 'belongsTo') {
        const id = snapshot.belongsTo(relationship.key, { id: true });
        if (id) {
          json[underscore(relationship.key)] = id;
        } else {
          json[relationship.key] = null;
        }
      }
    });

    return json;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    supabase: SupabaseSerializer;
  }
}
