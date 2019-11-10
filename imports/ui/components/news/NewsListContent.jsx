import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import NewsItem from './NewsItem.jsx';
import NewsFeatured from './NewsFeatured.jsx';
import Posts from '../../../api/posts/posts_collection.js';
import { Paginator } from 'react-everafter';

function NewsListContent() {
  let [state, setState] = useState({
    posts: []
  });

  useEffect(function() {
    Meteor.subscribe('posts', { onReady: function() {
      Meteor.subscribe('latestFeaturedPost', { onReady: function() {
        Meteor.subscribe('djs', { onReady: function() {
          Meteor.subscribe('djProfiles', { onReady: function() {
            let featuredPost = Posts.findOne({
              approved: true, featured: true },
            { sort: { submitted: -1 } });
            setState({
              posts: Posts.find(featuredPost && {
                _id: {
                  $ne: featuredPost._id
                },
                approved: true } || { approved: true },
              { sort: { submitted: -1 } }).fetch()
            });
          }
          });
        }
        });
      }
      }); }
    });
  }, [state.posts]);


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
