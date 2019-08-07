import React from 'react';
import { bool, object, array } from 'prop-types';
import Posts from '../../../api/posts/posts_collection.js';
import Comments from '../../../api/comments/comments_collection.js';
import CommentItem from '../comments/CommentItem.jsx';
import CommentSubmit from '../comments/CommentSubmit.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { displayNameById, dateFormat } from '../../../startup/lib/helpers.js';
import { Metamorph } from 'react-metamorph';
import { Meteor } from 'meteor/meteor';

function NewsPage({ ready, post, comments }) {
  if (ready) {
    let { summary, title, thumbnail, userId, author, photo, body, submitted } =
      post;
    return [<Metamorph description={summary} title={`${title
    } - KTUH FM Honolulu | Radio for the People`}
    image={thumbnail || 'https://ktuh.org/img/ktuh-logo.png'} />,
    <h1 key="header-title" className='general__header'>{title}</h1>,
    <div key="radioblog-back-link" className='show__link'>
      <a href='/radioblog' className='back-to'>← Back to Radioblog</a>
    </div>,
    <div className='news-item' key="name-submitted">
      <p className='news-item__author'>
        {author && <b>Posted by {userId ? <a href={`/profile/${author}`}>
          {displayNameById(userId) || author}</a> : author}</b> || null}<br />
        {dateFormat(submitted, 'dddd, MMMM DD, YYYY')}
      </p>
      <img className='news-item__photo'
        src={thumbnail || (photo && photo.url) ||
        '/mstile-310x310.png'} />
      <div className='news-item__body'
        dangerouslySetInnerHTML={{ __html: body }} />
      <div className='comments'>
        <h3 className='comments__header'>Comments</h3>
        {comments.length &&<ul className='comments__list'>
          {comments.map((comment) =>
            <CommentItem key={comment._id} comment={comment}/>)}</ul> || null}
        {Meteor.user() && <CommentSubmit /> ||
          <p className='comments__text'>
            <i>Please log in to leave a comment.</i>
          </p>}
      </div>
    </div>];
  }
  else return null;
}

NewsPage.propTypes = {
  ready: bool,
  post: object,
  comments: array
};

export default withTracker(() => {
  let slug = FlowRouter.getParam('slug'),
    s0, s1, handle = Meteor.subscribe('singlePost', slug, {
      onReady: function() {
        let post = Posts.findOne({ slug: slug, approved: true });
        if (!post) {
          FlowRouter.go('/radioblog');
          return;
        }
        s0 = Meteor.subscribe('comments', post._id);
        if (post.userId) s1 = Meteor.subscribe('profileData', post.userId);
      }
    });

  return {
    ready: handle.ready() && (s0 && s0.ready() || false) &&
      (s1 && s1.ready() || s1 === undefined),
    comments: Comments.find().fetch(),
    post: Posts.findOne({ slug: slug })
  };
})(NewsPage);
