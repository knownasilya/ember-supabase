import Service from '@ember/service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getOwner } from '@ember/application';

export default class SupabaseService extends Service {
  client: SupabaseClient;

  constructor() {
    super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');
    const { url, key } = config.supabase;

    // Create a single supabase client for interacting with your database
    const supabase = createClient(url, key);

    this.client = supabase;
  }

  async restoreSession() {
    const session = this.client.auth.session();

    if (session) {
      return { data: session };
    }

    const { data, error } = await this.client.auth.getSessionFromUrl({
      storeSession: true,
    });
    return { data, error };
  }

  async login(email: string) {
    const { error, data } = await this.client.auth.api.sendMagicLinkEmail(
      email
    );
    return { data, error };
  }

  async logout() {
    await this.client.auth.signOut();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    supabase: SupabaseService;
  }
}
