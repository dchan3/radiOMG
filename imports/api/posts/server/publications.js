import { Meteor } from 'meteor/meteor';
import Posts from '../posts_collection.js'
import { check } from 'meteor/check';

Meteor.publish('postsLimited', (options) => {
  check(options, {
    sort: Object,
    limit: Number
  });

  let featuredPost = Posts.findOne({ approved: true, featured: true },
      { sort: { submitted: -1 } }), query = { featured: false, approved: true };

  if (featuredPost) {
    query._id = { $ne: featuredPost._id };
  }

  return Posts.find(query, options);
});

Meteor.publish('posts', function() {
  let featuredPost = Posts.findOne({ approved: true, featured: true },
    { sort: { submitted: -1 } });

  return Posts.find(featuredPost ? { _id: {
    $ne: featuredPost._id }, approved: true
  } : { approved: true }, { sort: { submitted: -1 } });
});

Meteor.publish('latestFeaturedPost', () =>
  Posts.find({ approved: true, featured: true },
    { sort: { submitted: -1 }, limit: 1 }));

Meteor.publish('singlePost', (slug) => {
  check(slug, String);
  return Posts.find({ slug: slug });
});

Meteor.publish('singlePostById', (id) => {
  check(id, String);
  return Posts.find({ _id: id });
});

Meteor.publish('postsByUser', (username) => {
  check(username, String);
  return Posts.find({ author: username, approved: true },
    { fields: { submitted: 1, title: 1, author: 1, userId: 1, slug: 1 } });
});
