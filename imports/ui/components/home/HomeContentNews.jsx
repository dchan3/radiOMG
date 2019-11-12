import React from 'react';
import HomeContentNewsItem from './HomeContentNewsItem.jsx';
import Posts from '../../../api/posts/posts_collection.js';
import { Meteor } from 'meteor/meteor';
import useSubscribe from '../../hooks/useSubscribe';

function HomeContentNews() {
  let state = useSubscribe({
    posts: []
  }, function (fxn) {
    return Meteor.subscribe('postsLimited', {
      limit: 6, sort: { submitted: -1 }
    }, { onReady: function() {
      Meteor.subscribe('djs', { onReady: function() {
        Meteor.subscribe('djProfiles', { onReady: function() {
          fxn({
            posts: Posts.find({ approved: true }).fetch()
          });
        }
        });
      }
      });
    }
    });
  });

  return state.posts.length ? <div className='home__news'>
    <a href='/radioblog'>
      <h3 className='home__section'>RADIOBLOG</h3>
    </a>
    <a href='/radioblog' className='home__more'>
      MORE NEWS{'  '}
      <span className='glyphicon glyphicon-arrow-right'></span>
    </a>
    <div className='home__news-content'>
      {state.posts.map((item) => (
        <HomeContentNewsItem item={item} />))}
    </div>
  </div> : null;
}

export default HomeContentNews;
