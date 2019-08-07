import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Shows from '../../../api/shows/shows_collection.js';
import { getLocalTime } from '../../../startup/lib/helpers.js';
import { withTracker } from 'meteor/react-meteor-data';
import ShowItem from './ShowItem.jsx';
import { Metamorph } from 'react-metamorph';

function ShowList({ ready }) {
  const day = FlowRouter.getQueryParam('day'),
    dows = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'], date = getLocalTime();

  let [, setState] = useState({
    day: dows.indexOf(FlowRouter.getQueryParam('day'))
  });


  function active(d) {
    // We're not routed to a particular day of the week
    let activeDay = (day === undefined || dows.indexOf(day) === -1) ?
      date.day() : dows.indexOf(day);
    if (d === dows[activeDay]) return 'active';
    return '';
  }

  function daysShows() {
    let startDay = 0;
    if (day === undefined || !dows.includes(day)) {
      startDay = date.day();
    } else {
      startDay = dows.indexOf(day);
    }
    return Shows.find({ startDay },
      { sort: { startHour: 1, startMinute: 1 } }).fetch();
  }

  function handleClick(event) {
    event.preventDefault();
    return function(day) {
      setState({ day });
    }
  }

  function dowButtons(width) {
    return <div className={`shows__days shows__days__${width}`}>
      {dows.map(function(day, i) {
        return (
          <a href={`/shows?day=${day}` } onClick={(e) => handleClick(e)(i)}>
            <span className={`shows__day ${active(day)}`}>
              {width === 'narrow' ? day.substring(0,3) : day}</span>
          </a>
        );
      })}
    </div>
  }

  if (ready)
    return [
      <Metamorph title='Show Schedule - KTUH FM Honolulu | Radio for the People'
        description='Show Schedule on KTUH' image=
          'https://ktuh.org/img/ktuh-logo.jpg' />,
      <h2 className='general__header' key='header'>Show Schedule</h2>,
      <div className='shows'>
        {dowButtons('wide')}
        {dowButtons('narrow')}
        {daysShows().map((show) => <ShowItem {...{ show }} key={show._id} />)}
      </div>
    ];
  else return null;
}

ShowList.propTypes = {
  ready: PropTypes.bool
};

export default withTracker(() => {
  let s1 = Meteor.subscribe('activeShows'), s2 = Meteor.subscribe('djs');

  return {
    ready: s1.ready() && s2.ready()
  }
})(ShowList);
