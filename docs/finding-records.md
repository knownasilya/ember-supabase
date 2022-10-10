Finding Records
==============================================================================

## Finding One Item By Id

```js
return this.store.findRecord('user', 1, {
  include: 'posts',
});
```

## Finding All Items

```js
return this.store.findAll('post', {
  include: 'user',
});
```

## Filtering

```js
return this.store.query('post', {
  include: 'user,comments',
  filter: (ref) => {
    return ref
      .order('created_at', {
        ascending: false,
      })
      .limit(100);
  },
});
```

See https://supabase.com/docs/reference/javascript/using-filters for example filters that can be used.
