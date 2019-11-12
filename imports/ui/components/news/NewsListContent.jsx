import React from 'react';
import { Meteor } from 'meteor/meteor';
import NewsItem from './NewsItem.jsx';
import NewsFeatured from './NewsFeatured.jsx';
import Posts from '../../../api/posts/posts_collection.js';
import { Paginator } from 'react-everafter';
import useSubscribe from '../../hooks/useSubscribe';

function NewsListContent() {
  let state = useSubscribe({
    posts: []
  }, function(fxn) {
    return Meteor.subscribe('posts', { onReady: function() {
      Meteor.subscribe('djs', { onReady: function() {
        Meteor.subscribe('djProfiles', { onReady: function() {
          fxn({
            posts: Posts.find({ approved: true },
              { sort: { submitted: -1 } }).fetch()
          });
        }
        });
      }
      });
    }
    });
  });


  return <div className='news-list__content'>
    <div className='news-list'>
      <NewsFeatured />
      {state.posts.length ?
        <Paginator wrapper={NewsItem} perPage={4}
          items={state.posts} truncate /> : null}
    </div>
  </div>;
}

export default NewsListContent;
