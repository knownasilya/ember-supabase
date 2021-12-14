import JSONSerializer from '@ember-data/serializer/json';
import { underscore } from '@ember/string';

export default class SupabaseSerializer extends JSONSerializer {
  keyForAttribute(key: string): string {
    return underscore(key);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    'supabase': SupabaseSerializer;
  }
}
