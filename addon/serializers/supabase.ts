import JSONSerializer from '@ember-data/serializer/json';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

import type Store from '@ember-data/store';

interface Links {
  [key: string]: string;
}

interface ResourceHash {
  id: string;
  links: Links;
  [key: string]: string | Links;
}

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

export default class SupabaseSerializer extends JSONSerializer {
  keyForAttribute(key: string): string {
    return underscore(key);
  }

  extractRelationships(
    modelClass: ModelClass,
    resourceHash: ResourceHash
  ): {} {
    const newResourceHash = { ...resourceHash };
    const links: { [key: string]: string } = {};

    modelClass.eachRelationship((name, descriptor) => {
      if (descriptor.kind === 'belongsTo') {
        const id = resourceHash[name];
        const path = `${name}/${id}`;
        links[name] = path;
      } else {
        links[name] = pluralize(descriptor.type);
      }
    });

    newResourceHash.links = links;

    return super.extractRelationships(modelClass, newResourceHash);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    supabase: SupabaseSerializer;
  }
}
