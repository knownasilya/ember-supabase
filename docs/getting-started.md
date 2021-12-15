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

TBD


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
