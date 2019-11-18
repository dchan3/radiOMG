import React from 'react';
import ReviewItem from './ReviewItem.jsx';
import Reviews from '../../../api/reviews/reviews_collection.js';
import { Meteor } from 'meteor/meteor';
import { Paginator } from 'react-everafter';
import { Metamorph } from 'react-metamorph';
import useSubscribe from '../../hooks/useSubscribe';
function ReviewList() {
  let state = useSubscribe({
    reviews: []
  },function(fxn) {
    return Meteor.subscribe('approvedReviews', {
      onReady: function() {
        fxn({ reviews: Reviews.find({ approved: true },
          { sort: { submitted: -1 } }).fetch() });
      }
    });
  });

  return state.reviews.length ? [
    <Metamorph title="Reviews - KTUH FM Honolulu | Radio for the People"
      description="KTUH Reviews" image='https://ktuh.org/img/ktuh-logo.jpg' />,
    <h2 className="general__header" key="header-title">Reviews</h2>,
    <div className="reviews__content" key="reviews-content">
      <Paginator wrapper={ReviewItem} truncate perPage={8}
        items={state.reviews} />
    </div>
  ] : null;
}

export default ReviewList;
