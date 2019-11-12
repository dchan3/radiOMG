import React from 'react';
import Reviews from '../../../api/reviews/reviews_collection.js';
import HomeContentReviewsItem from './HomeContentReviewsItem.jsx';
import { Meteor } from 'meteor/meteor';
import useSubscribe from '../../hooks/useSubscribe';

function HomeContentReviews() {
  let state = useSubscribe({
    reviews: []
  },function(fxn) {
    return Meteor.subscribe('reviewsLimited',
      { limit: 6, sort: { submitted: -1 } }, {
        onReady: function() {
          fxn({ reviews: Reviews.find({ approved: true },
            { sort: { submitted: -1 } }).fetch() });
        }
      });
  });

  return <div className='home__reviews'>
    <a href='/reviews' key='reviews-link'>
      <h3 className="home__section">MUSIC REVIEWS</h3>
    </a>
    <a href='/reviews' className='home__more' key='reviews-more'>
      MORE REVIEWS{'  '}
      <span className='glyphicon glyphicon-arrow-right'></span>
    </a>
    <div className='home__reviews-content' key='reviews-content'>
      {state.reviews.map((item) => (<HomeContentReviewsItem item={item} />))}
    </div>
  </div>;
}

export default HomeContentReviews;
