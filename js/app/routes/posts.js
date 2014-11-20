import Post from 'js/models/post';
import Comment from 'js/models/comment';

var PostsRoute = Ember.Route.extend({
    model: function() {
        var posts = [];
        var comments = [];
        return $.getJSON('/api/posts', function(response) {
            var comment_promises = [];
            response.forEach(function(post_hash) {
                var post_id = post_hash.id;
                var post = Post.create(post_hash);
                Ember.run(posts, posts.pushObject, post);
                var promise = $.getJSON('/api/posts/%@/comments'.fmt(post_id));
                comment_promises.push(promise);
            });
            return Ember.RSVP.all(comment_promises).then(function(comments_promises) {
                comments_promises.forEach(function(comments_data) {
                    comments_data.forEach(function(comment_hash) {
                        var comment = Comment.create(comment_hash);
                        Ember.run(comments, comments.pushObject, comment);
                    });
                });
                //todo: assign post.comments correctly
                return posts;
            });
        });
    }
});



export default PostsRoute;
