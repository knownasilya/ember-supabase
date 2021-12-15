import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import SupabaseService from 'ember-supabase/services/supabase';

import type { Session } from '@supabase/gotrue-js';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient';

type User = any;
type Provider = any;

interface SBResponse {
  session: Session | null;
  user: User | null;
  provider?: Provider;
  url?: string | null;
  error: Error | null;
}

export default class SupabaseAuthenticator extends BaseAuthenticator {
  @service declare supabase: SupabaseService;

  private get fastboot(): FastBootService | null {
    return getOwner(this).lookup('service:fastboot');
  }

  public async authenticate(
    callback: (auth: SupabaseAuthClient) => Promise<any>
  ): Promise<Record<string, unknown>> {
    const { auth } = this.supabase.client;
    const response = (await callback(auth)) as SBResponse;
    return new Promise((resolve, reject) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.user);
      }
    });
  }

  public async invalidate(): Promise<void> {
    return await this.supabase.logout();
  }

  public async restore(): Promise<Session> {
    const auth = await this.supabase.restoreSession();
    if (!auth.error || !auth.data) {
      throw auth.error;
    }
    return auth.data;
  }
}
