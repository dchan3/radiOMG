import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Posts from '../../../api/posts/posts_collection.js';
import { usernameById, displayNameById, timeDiffString, renderSummary,
  getPathBySlug } from '../../../startup/lib/helpers.js';
import { Meteor } from 'meteor/meteor';

function NewsFeatured() {
  let [state, setState] = useState({
    featuredPost: null
  });

  useEffect(function() {
    Meteor.subscribe('latestFeaturedPost', {
      onReady: function() {
        let latestFeaturedPost =
          Posts.findOne({ approved: true, featured: true },
            { sort: { submitted: -1 } });

        if (latestFeaturedPost) {
          Meteor.subscribe('profileData', latestFeaturedPost.userId);
          setState({ featuredPost: latestFeaturedPost })
        }
      }
    });
  }, [state.featuredPost]);

  if (state.featuredPost) {
    let { thumbnail, photo, slug, title, author, summary, userId, submitted } =
      state.featuredPost, path = getPathBySlug('/radioblog/:slug', slug),
      synopsis = renderSummary(summary, 60),
      username = userId ? usernameById(userId) : undefined,
      displayName = displayNameById(userId),
      timeDiff = timeDiffString(submitted);

    return <div className='news-list__featured'>
      <div className='news-list__featured-img'>
        <img src={thumbnail || (photo && photo.url) || '/mstile-310x310.png'} />
        <span className='purple-tag'>Featured</span>
      </div>
      <div className='news-list__featured-item'>
        <a href={`/radioblog/${slug}`}>
          <h2 className='news-list__featured-title'>{title}</h2>
        </a>
        <p>{`${synopsis}  `}
          <a className='purple-text' href={path}><i>Read On</i></a>
        </p>
        <p className='news-list__byline'>{'by '}
          {username ? <a href={`/profile/${username}`}>
            {displayName || username}</a> : author}{' / '}{timeDiff}</p>
      </div>
    </div>;
  }
  else return null;
}

NewsFeatured.propTypes = {
  featuredPost: PropTypes.object,
  ready: PropTypes.bool
};

export default NewsFeatured;
