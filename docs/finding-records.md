Find Records
==============================================================================

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