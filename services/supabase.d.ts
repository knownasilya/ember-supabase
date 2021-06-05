import Service from '@ember/service';
import { SupabaseClient } from '@supabase/supabase-js';
export default class Supabase extends Service {
    client: SupabaseClient;
    constructor();
    restoreSession(): Promise<{
        data: import("@supabase/supabase-js").AuthSession | null;
        error: Error | null;
    }>;
}
declare module '@ember/service' {
    interface Registry {
        supabase: Supabase;
    }
}
