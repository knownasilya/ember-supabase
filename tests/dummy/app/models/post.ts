import Model, { attr } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('date') declare createdAt: Date;
  @attr('string') declare title: string;
  @attr('string') declare body: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'post': PostModel;
  }
}
