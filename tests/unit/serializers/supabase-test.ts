import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

import type SupabaseSerializer from 'ember-supabase/serializers/supabase';
import type Store from '@ember-data/store';
import type PostModel from 'dummy/tests/dummy/app/models/post';
import type ModelRegistry from 'ember-data/types/registries/model';

module('Unit | Serializer | supabase', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store') as Store;
    const serializer = store.serializerFor('supabase');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    const store = this.owner.lookup('service:store') as Store;
    const record = run(() => store.createRecord('post', {}));

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it normalizes responses', function (assert) {
    const serializer = this.owner.lookup(
      'serializer:supabase'
    ) as SupabaseSerializer;

    const store = this.owner.lookup('service:store') as Store;
    const modelClass = store.modelFor('post') as PostModel & {
      modelName: keyof ModelRegistry;
    };
    const payload = {
      id: 1,
      user: 1,
      createdAt: '2022-01-13T22:35:55+00:00',
      title: 'Title',
      body: 'Body',
    };
    const id = 1;
    const requestType = 'findRecord';

    const result = serializer.normalizeResponse(
      store,
      modelClass,
      payload,
      id,
      requestType
    );

    assert.deepEqual(result, {
      data: {
        attributes: {
          body: 'Body',
          title: 'Title',
        },
        id: '1',
        relationships: {
          comments: {
            links: {
              related: 'comment',
            },
          },
          user: {
            data: {
              id: '1',
              type: 'user',
            },
            links: {
              related: 'user/1',
            },
          },
        },
        type: 'post',
      },
      included: [],
    });
  });

  test('it loads included records', function (assert) {
    const serializer = this.owner.lookup(
      'serializer:supabase'
    ) as SupabaseSerializer;

    const store = this.owner.lookup('service:store') as Store;
    const modelClass = store.modelFor('post') as PostModel & {
      modelName: keyof ModelRegistry;
    };
    const payload = {
      id: 1,
      user: 1,
      createdAt: '2022-01-13T22:35:55+00:00',
      title: 'Title',
      body: 'Body',
      comments: [
        {
          body: 'Here is a comment.',
          created_at: '2022-01-13T22:35:55+00:00',
          id: 1,
          post: 2,
          user: 3,
        },
      ],
    };
    const id = 1;
    const requestType = 'findRecord';

    const result = serializer.normalizeResponse(
      store,
      modelClass,
      payload,
      id,
      requestType
    );

    assert.deepEqual(result.data, {
      attributes: {
        body: 'Body',
        title: 'Title',
      },
      id: '1',
      relationships: {
        comments: {
          data: [
            {
              id: '1',
              type: 'comment',
            },
          ],
          links: {
            related: 'comment',
          },
        },
        user: {
          data: {
            id: '1',
            type: 'user',
          },
          links: {
            related: 'user/1',
          },
        },
      },
      type: 'post',
    });

    assert.deepEqual((result.included as any)[0].relationships, {
      post: {
        data: {
          id: '2',
          type: 'post',
        },
        links: {
          related: 'post/2',
        },
      },
      user: {
        data: {
          id: '3',
          type: 'user',
        },
        links: {
          related: 'user/3',
        },
      },
    });
  });
});
