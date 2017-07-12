import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts_collection.js'
import { pagination } from 'meteor/kurounin:pagination';

Meteor.publish('postsLimited', (options) => {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({ approved: true }, options);
});

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
  return Posts.find({ author: username }, { fields: { submitted: 1, title: 1, 
                                                      author: 1, userId: 1 }});
});

Meteor.publish('chartsPosts', () => Posts.find({ isChart: true }, { sort: { submitted: -1 }, 
                                                 fields: { slug: 1, submitted: 1, title: 1 }}));

new Meteor.Pagination(Posts);
