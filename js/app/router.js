var Router = Ember.Router.extend();

Router.map(function() {
    this.resource("posts", { path: "/" });
});

export default Router;
