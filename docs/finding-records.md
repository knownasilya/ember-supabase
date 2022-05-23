Finding Records
==============================================================================

```js
return this.store.findRecord('user', 1, {
  include: 'posts',
});
```

```js
return this.store.findAll('post', {
  include: 'user',
});
```

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
