var App;

module('integration tests', {
    setup: function() {
        App = startApp();
    },
    teardown: function() {
        $.fauxjax.clear();
        Ember.run(App, 'destroy');
    }
});

test('will not hang with many nested promises', function() {
    var posts = [{id: 1, title: 'first'}, {id: 2, title: 'last'}];
    $.fauxjax.new({
      type: 'GET',
      url: '/api/posts',
      dataType: 'json',
      responseText: posts
    });

    var comments_one = [{id: 99, desc: 'yo', post_id: 1}, {id: 98, desc: 'go', post_id: 1}];
    $.fauxjax.new({
      type: 'GET',
      url: '/api/posts/1/comments',
      dataType: 'json',
      responseText: comments_one
    });

    var comments_two = [{id: 88, desc: 'cat', post_id: 2}, {id: 87, desc: 'wat', post_id: 2}];
    $.fauxjax.new({
      type: 'GET',
      url: '/api/posts/2/comments',
      dataType: 'json',
      responseText: comments_two
    });

    visit("/");
    andThen(function() {
        var rows = find(".post_title").length;
        equal(rows, 2, rows);
        var first = find(".post_title:eq(0)");
        equal(first.text(), "first");
        var last = find(".post_title:eq(1)");
        equal(last.text(), "last");
    });
});
