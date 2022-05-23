import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import type { SignInResponse } from 'ember-supabase/authenticators/supabase';
import type Transition from '@ember/routing/-private/transition';

declare module 'ember-simple-auth/services/session' {
  export default class Session {
    isAuthenticated: boolean;
    data: unknown;
    // store: ApplicationSessionStore;
    attemptedTransition: Transition;
    session: null;

    authenticate(
      authenticator: string,
      callback: (auth: SupabaseAuthClient) => Promise<SignInResponse>
    ): Promise<void>;
    invalidate(): Promise<void>;
    requireAuthentication(
      transition: Transition,
      routeName: string
    ): Promise<void>;
    prohibitAuthentication(routeName: string): Promise<void>;
    handleAuthentication(routeAfterAuthentication?: string): void;
    setup(): Promise<void>;
  }
}
