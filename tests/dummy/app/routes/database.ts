import Route from '@ember/routing/route';

export default class DatabaseRoute extends Route {
  model() {
    return this.store.findAll('post');
  }
}
