import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient';
import type Transition from '@ember/routing/-private/transition';

declare module 'ember-simple-auth/services/session' {
  export default class Session {
    isAuthenticated: boolean;
    data: any;
    // store: ApplicationSessionStore;
    attemptedTransition: Transition;
    session: null;

    authenticate(
      authenticator: string,
      callback: (auth: SupabaseAuthClient) => Promise<any>
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
