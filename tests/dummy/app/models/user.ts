import Model, { attr, hasMany, AsyncHasMany } from '@ember-data/model';

import type PostModel from './post';
import type CommentModel from './comment';

export default class UserModel extends Model {
  @attr('string') declare email: string;

  @hasMany('post') declare posts: AsyncHasMany<PostModel>;
  @hasMany('comment') declare comments: AsyncHasMany<CommentModel>;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: UserModel;
  }
}
