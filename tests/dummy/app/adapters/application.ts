import SupabaseAdapter from 'ember-supabase/adapters/supabase';

export default class ApplicationAdapter extends SupabaseAdapter {}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'application': ApplicationAdapter;
  }
}
