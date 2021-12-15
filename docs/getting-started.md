Getting Started
==============================================================================

Initialization
------------------------------------------------------------------------------

Add the following to `/config/environment.js`:

```javascript
let ENV = {
  ...

  supabase: {
    url: '<SUPABASE_URL>',
    key: '<SUPABASE_KEY>',
  },

  ...
}
```


Authentication
------------------------------------------------------------------------------

### Signing In

Authentication is supported by [ember-simple-auth](https://github.com/simplabs/ember-simple-auth) via a Superbase authenticator.

```javascript
this.session.authenticate('authenticator:supabase', (auth) => {
  return _TODO_(auth, 'me@example.com', 'password');
});
```

### Signing Out

Call `invalidate()` on the `session` service provided by `ember-simple-auth`.

```javascript
this.session.invalidate();
```


Database
------------------------------------------------------------------------------

https://supabase.com/docs/reference/javascript/initializing

Create an application adapter by running:

```bash
ember generate adapter application
```

Change it to look something like this:

```javascript
import SupabaseAdapter from 'ember-supabase/adapters/supabase';

export default class ApplicationAdapter extends SupabaseAdapter {}
```

Create an application serializer by running:

```bash
ember generate serializer application
```

Change it to look something like this:

```javascript
import SupabaseSerializer from 'ember-supabase/serializers/supabase';

export default class ApplicationSerializer extends SupabaseSerializer {}
```


Storage
------------------------------------------------------------------------------

TBD
