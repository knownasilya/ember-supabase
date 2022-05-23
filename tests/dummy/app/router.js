import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('authentication');
  this.route('database', function () {
    this.route('query');
    this.route('find-all');
    this.route('find-record');
    this.route('create-record');
    this.route('update-record');
  });
  this.route('storage');
});
