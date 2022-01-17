import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import SupabaseService from 'ember-supabase/services/supabase';

export default class StorageController extends Controller {
  @service declare supabase: SupabaseService;

  @tracked url?: string;
  @tracked error?: string;

  @action async upload(
    event: Event & { target: HTMLInputElement & { files: FileList } }
  ): Promise<any> {
    const { files } = event.target;
    const [file] = files;

    const { data, error } = await this.supabase.client.storage
      .from('uploads')
      .upload(file.name, file);

    if (error) {
      this.error = error.message;
    } else {
      const { signedURL, error } = await this.supabase.client.storage
        .from('uploads')
        .createSignedUrl(file.name, 60);

      if (error) {
        this.error = error.message;
      } else {
        this.url = signedURL as string;
      }
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    storage: StorageController;
  }
}
