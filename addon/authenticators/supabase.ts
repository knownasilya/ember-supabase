import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import SupabaseService from 'ember-supabase/services/supabase';
import { Session } from '@supabase/gotrue-js';

export default class SupabaseAuthenticator extends BaseAuthenticator {
  @service('supabase') declare supabase: SupabaseService;

  private get fastboot(): FastBootService | null {
    return getOwner(this).lookup('service:fastboot');
  }

  public async authenticate(
    callback: () => void
  ): Promise<Record<string, unknown>> {
    return {};
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
