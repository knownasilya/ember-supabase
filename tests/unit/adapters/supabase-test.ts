import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

import type SupabaseAdapter from 'ember-supabase/adapters/supabase';
import type Store from '@ember-data/store';
import type PostModel from 'dummy/tests/dummy/app/models/post';
import type ModelRegistry from 'ember-data/types/registries/model';

class SupabaseServiceStub extends Service {
  client = {
    from: () => ({
      select: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              user: 1,
              createdAt: '2022-01-13T22:35:55+00:00',
              title: 'Title',
              body: 'Body',
            },
          ],
          error: null,
        }),
    }),
  };
}

module('Unit | Adapter | supabase', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:supabase', SupabaseServiceStub);
  });

  test('it exists', function (assert) {
    const adapter = this.owner.lookup('adapter:supabase') as SupabaseAdapter;
    assert.ok(adapter);
  });

  test('it queries records', async function (assert) {
    const adapter = this.owner.lookup('adapter:supabase') as SupabaseAdapter;

    const store = this.owner.lookup('service:store') as Store;
    const modelClass = store.modelFor('post') as PostModel & {
      modelName: keyof ModelRegistry;
    };

    const response = await adapter.query(store, modelClass, {});

    assert.deepEqual(response, [
      {
        id: 1,
        user: 1,
        createdAt: '2022-01-13T22:35:55+00:00',
        title: 'Title',
        body: 'Body',
      },
    ]);
  });
});
