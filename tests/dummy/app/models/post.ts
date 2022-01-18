import Model, { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';

import type UserModel from './user';
import type CommentModel from './comment';

export default class PostModel extends Model {
  @belongsTo('user') declare user: AsyncBelongsTo<UserModel>;

  @attr('date', {
    defaultValue() {
      return new Date();
    },
  })
  declare createdAt: Date;
  @attr('string') declare title: string;
  @attr('string') declare body: string;

  @hasMany('comment') declare comments: AsyncHasMany<CommentModel>;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    post: PostModel;
  }
}
