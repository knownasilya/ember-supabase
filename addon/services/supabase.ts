import Service from '@ember/service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getOwner } from '@ember/application';

import type ApplicationInstance from '@ember/application/instance';
import type Config from 'dummy/tests/dummy/app/config/environment';

export default class SupabaseService extends Service {
  client: SupabaseClient;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    super(...args);

    const config = (getOwner(this) as ApplicationInstance).resolveRegistration(
      'config:environment'
    );
    const { url, key } = (config as typeof Config).supabase;

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
