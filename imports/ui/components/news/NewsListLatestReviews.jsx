import React from 'react';
import NewsListLatestReviewsItem from './NewsListLatestReviewsItem.jsx';
import Reviews from '../../../api/reviews/reviews_collection.js';
import { Meteor } from 'meteor/meteor';
import useSubscribe from '../../hooks/useSubscribe';

function NewsListLatestReviews() {
  let state = useSubscribe({
    reviews: []
  }, function(fxn) {
    return Meteor.subscribe('reviewsLimited',
      { limit: 6, sort: { submitted: -1 } }, {
        onReady: function() {
          fxn({ reviews:  Reviews.find({}).fetch() })
        }
      });
  });

  if (state.reviews.length) return (
    <div className='news-list__latest-reviews'>
      <h4>LATEST REVIEWS</h4>
      {state.reviews.map((review) => (
        <NewsListLatestReviewsItem {...{ review }} key={review._id} />))}
    </div>
  );
  else return null;
}

export default NewsListLatestReviews;
