import React, { useEffect, useState } from 'react';
import PartyItem from './PartyItem.jsx';
import Parties from '../../../api/parties/parties_collection.js';
import { Meteor } from 'meteor/meteor';
import { Metamorph } from 'react-metamorph';

function PartyList() {
  let [state, setState] = useState({
    parties: []
  });

  useEffect(function() {
    Meteor.subscribe('approvedParties', { onReady: function() {
      setState({ parties: Parties.find({}).fetch() });
    } });
  }, [state.parties]);

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
