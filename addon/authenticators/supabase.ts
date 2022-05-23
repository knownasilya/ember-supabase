import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import SupabaseService from 'ember-supabase/services/supabase';

import type ApplicationInstance from '@ember/application/instance';
import type { Session, User, Provider, ApiError } from '@supabase/gotrue-js';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

// TODO: copied type from `@supabase/supabase-js`
export interface SignInResponse {
  session: Session | null;
  user: User | null;
  provider?: Provider;
  url?: string | null;
  error: ApiError | null;
}

export default class SupabaseAuthenticator extends BaseAuthenticator {
  @service private declare supabase: SupabaseService;

  // @ts-ignore
  private get fastboot(): FastBootService | null {
    return (getOwner(this) as ApplicationInstance).lookup(
      'service:fastboot'
    ) as FastBootService | null;
  }

  public async authenticate(
    callback: (auth: SupabaseAuthClient) => Promise<SignInResponse>
  ): Promise<Session> {
    const { auth } = this.supabase.client;
    const response = await callback(auth);
    return new Promise((resolve, reject) => {
      if (response.error || !response.session) {
        reject(response.error);
      } else {
        resolve(response.session);
      }
    });
  }

  public async invalidate(): Promise<void> {
    return await this.supabase.logout();
  }

  public async restore(): Promise<Session> {
    const auth = await this.supabase.restoreSession();
    if (auth.error || !auth.data) {
      throw auth.error;
    }
    return auth.data;
  }
}
