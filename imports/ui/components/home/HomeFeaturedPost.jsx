import React from 'react';
import { renderSummary } from '../../../startup/lib/helpers.js';
import Posts from '../../../api/posts/posts_collection.js';
import { Meteor } from 'meteor/meteor';
import useSubscribe from '../../hooks/useSubscribe';

function HomeFeaturedPost() {
  let state = useSubscribe({
    post: null
  },function(fxn) {
    return Meteor.subscribe('latestFeaturedPost', { onReady:
      function() {
        fxn({ post: Posts.findOne({
          approved: true, featured: true
        }, {
          sort: { submitted: -1 }
        }) });
      }
    });
  });

  if (state.post) {
    let { thumbnail, photo, category, slug, title, summary } = state.post;
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
