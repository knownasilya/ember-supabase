import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import SupabaseService from 'ember-supabase/services/supabase';
import { Session } from '@supabase/gotrue-js';

import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient';

export default class SupabaseAuthenticator extends BaseAuthenticator {
  @service declare supabase: SupabaseService;

  private get fastboot(): FastBootService | null {
    return getOwner(this).lookup('service:fastboot');
  }

  public async authenticate(
    callback: (auth: SupabaseAuthClient) => Promise<any>
  ): Promise<Record<string, unknown>> {
    const { auth } = this.supabase.client;
    return await callback(auth);
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
