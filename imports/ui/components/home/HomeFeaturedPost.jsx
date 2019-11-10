import React, { useState, useEffect } from 'react';
import { renderSummary } from '../../../startup/lib/helpers.js';
import Posts from '../../../api/posts/posts_collection.js';
import { Meteor } from 'meteor/meteor';

function HomeFeaturedPost() {
  let [state, setState] = useState({
    post: null
  })

  useEffect(function() {
    Meteor.subscribe('latestFeaturedPost', { onReady:
      function() {
        setState({ post: Posts.findOne({
          approved: true, featured: true
        }, {
          sort: { submitted: -1 }
        }) });
      }
    });
  }, [state.post]);

  if (state.post) {
    var { thumbnail, photo, category, slug, title, summary } = state.post;
    return <div className='home__featured'>
      <div className='home__featured-content'>
        <div className='home__featured-photo'>
          <span className='purple-tag'>Featured</span>
          <img className='home__featured-img'
            src={thumbnail || (photo && photo.url) ||
            '/mstile-310x310.png'} /></div>
        <div className='home__featured-item'>
          <p className='home__featured-category'>{category}</p>
          <a href={`/radioblog/${slug}`}>
            <h3 className='home__title'>{title}</h3></a>
          <p className='home__synopsis'>{renderSummary(summary, 100)}</p>
        </div>
      </div>
    </div>;
  }
  else return null;
}

export default HomeFeaturedPost;
