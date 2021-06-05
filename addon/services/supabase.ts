import Service from '@ember/service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default class SupabaseService extends Service {
  #client: SupabaseClient;

  constructor() {
    super();
    // Create a single supabase client for interacting with your database
    const supabase = createClient(
      'https://ntrnjxrtkpvqhszgagun.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjE3MjExOSwiZXhwIjoxOTM3NzQ4MTE5fQ.CZ8Dzlo0tyl8S7Mz5EyEHj8sRowkMfsDVy02Uc596K0'
    );

    this.#client = supabase;
  }

  async restoreSession() {
    const { data, error } = await this.#client.auth.getSessionFromUrl({
      storeSession: true,
    });
    return { data, error };
  }

  async login(email: string) {
    const { error, data } = await this.#client.auth.api.sendMagicLinkEmail(
      email
    );
    return { data, error };
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    supabase: SupabaseService;
  }
}
