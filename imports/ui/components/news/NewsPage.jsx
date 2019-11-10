import React from 'react';
import Posts from '../../../api/posts/posts_collection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { displayNameById, dateFormat } from '../../../startup/lib/helpers.js';
import { Metamorph } from 'react-metamorph';
import { Meteor } from 'meteor/meteor';
import useSubscribe from '../../hooks/useSubscribe';

function NewsPage() {
  let state = useSubscribe({
    post: null
  }, function(fxn) {
    let slug = FlowRouter.getParam('slug');
    return Meteor.subscribe('singlePost', slug, {
      onReady: function() {
        let post = Posts.findOne({ slug: slug, approved: true });
        if (!post) {
          FlowRouter.go('/radioblog');
          return;
        }
        Meteor.subscribe('comments', post._id);
        if (post.userId) s1 = Meteor.subscribe('profileData', post.userId);
        fxn({ post });
      }
    });
  });

  if (state.post) {
    let { summary, title, thumbnail, userId, author, photo, body, submitted } =
      state.post;
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
    </div>];
  }
  else return null;
}

export default NewsPage;
