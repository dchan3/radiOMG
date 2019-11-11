import React from 'react';
import PartyItem from './PartyItem.jsx';
import Parties from '../../../api/parties/parties_collection.js';
import { Meteor } from 'meteor/meteor';
import { Metamorph } from 'react-metamorph';
import useSubscribe from '../../hooks/useSubscribe';

function PartyList() {
  let state = useSubscribe({
    parties: []
  }, function(fxn) {
    return Meteor.subscribe('approvedParties', { onReady: function() {
      fxn({ parties: Parties.find({}).fetch() });
    } });
  });

  return [
    <Metamorph title='Events - KTUH FM Honolulu | Radio for the People'
      description="KTUH Events" image='https://ktuh.org/img/ktuh-logo.jpg' />,
    <h2 className='general__header' key='header-title'>Events</h2>,
    <div className='events-list' key='event-list'>
      {state.parties.length && state.parties.map((party) =>
        <PartyItem key={party._id} party={party} />
      ) || <p>No events at this time. Check back later.</p>}
    </div>
  ];
}

export default PartyList;
