import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Parties from '../../../api/parties/parties_collection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Metamorph } from 'react-metamorph';
import { Bert } from 'meteor/themeteorchef:bert';
import { default as moment } from 'moment';
import useSubscribe from '../../hooks/useSubscribe';

function PartyPage() {
  function time(t) {
    return moment(t).format('dddd, MMMM Do YYYY, h:mm a');
  }

  function upvoted(upvoters) {
    if (!Meteor.user()) return '';

    let { username } = Meteor.user(), a = upvoters || [],
      i = a.indexOf(username);

    if (i >= -1) {
      return 'upvoted';
    }
    else return '';
  }

  function handleClickStar() {
    let user = Meteor.userId();

    if (user === null) {
      Bert.alert('Please log in (or register) to upvote.', 'info');
    }
    else {
      Meteor.call('upvoteParty', Parties.findOne()._id);
    }
  }

  let state = useSubscribe({
    party: null
  }, function(fxn) {
    let slug = FlowRouter.getParam('slug');
    return Meteor.subscribe('singleParty', slug, {
      onReady: function () {
        fxn({
          party: Parties.findOne({
            slug: FlowRouter.getParam('slug'),
            approved: true
          }),
        });
      }
    });
  });

  if (state.party) {
    let { title, thumbnail, summary, flyerFront, thumbnailBack, flyerBack,
      location, upvoters, tags, startTime, description
    } = state.party;

    return [
      <Metamorph title={`${title} - KTUH FM Honolulu | Radio for the People`}
        image={thumbnail || 'https://ktuh.org/img/ktuh-logo.png'}
        description={summary} />,
      <h1 className='general__header'>{title}</h1>,
      <div className='event__link'>
        <a href='/events' className='back-to'>← all events</a>
      </div>,
      <div className='event-item'>
        <div className='flyer-div'>
          <img className='flyer-div__front' src={thumbnail || flyerFront.url} />
          {flyerBack && <img className='flyer-div__back'
            src={thumbnailBack || flyerBack.url} /> || null}
        </div>
        <div className='party-info'>
          <h4>{location}</h4>
          <h5>{time(startTime)}</h5>
          <div dangerouslySetInnerHTML=
            {{ __html: description }} />
          <p className='party__tag'>
            {tags.map((tag) => `#${tag} `)}
          </p>
          <div className='party-info__details'>
            <span onClick={handleClickStar} className=
              {`party-info__star glyphicon glyphicon-star ${
                upvoted(upvoters)}`}>
            </span>
            <span className='party-info__upvotes-count'>
              {upvoters.length}
            </span>
          </div>
        </div>
      </div>,
      <div className='comments news-item'>
        <h3 className='comments__header'>Comments</h3>
      </div>]
  }
  else return null;
}

PartyPage.propTypes = {
  ready: PropTypes.bool,
  party: PropTypes.object,
  comments: PropTypes.array
}

export default PartyPage;
