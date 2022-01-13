import SupabaseSerializer from 'ember-supabase/serializers/supabase';

export default class ApplicationSerializer extends SupabaseSerializer {}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    'application': ApplicationSerializer;
  }
}
