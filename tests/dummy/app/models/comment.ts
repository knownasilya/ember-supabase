import Model, { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';

import type UserModel from './user';
import type PostModel from './post';

export default class CommentModel extends Model {
  @belongsTo('user') declare user: AsyncBelongsTo<UserModel>;
  @belongsTo('post') declare post: AsyncBelongsTo<PostModel>;

  @attr('date', {
    defaultValue() {
      return new Date();
    },
  })
  declare createdAt: Date;
  @attr('string') declare body: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    comment: CommentModel;
  }
}
