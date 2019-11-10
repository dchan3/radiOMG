import React from 'react';
import { nextShow, usernameById, displayNameById }
  from '../../../startup/lib/helpers.js';
import { default as momentUtil } from 'moment';
import useSubscribe from '../../hooks/useSubscribe';

function HomeSidebarNext() {
  function startEndTime(startHour, startMinute, endHour, endMinute) {
    if (startMinute === 1) {
      startMinute--;
    }
    if (endMinute === 59) {
      endHour = (endHour + 1) % 24;
      endMinute = 0;
    }
    let sp = '';
    if (startHour > endHour) sp = 'h:mm A';
    else sp = 'h:mm';
    return `${momentUtil(`${startHour}:${startMinute}`, 'HH:mm')
      .format(sp)}-${
      momentUtil(`${endHour}:${endMinute}`, 'HH:mm').format('h:mm A')}`;
  }

  let state = useSubscribe({ show: null }, function(fxn) {
    Meteor.subscribe('nextOnAir', {
      onReady: function () {
        let show = nextShow(), userId = show && show.userId;
        if (show) {
          Meteor.subscribe('profileData', userId);
          Meteor.subscribe('userById', userId);
        }
        fxn({ show });
      }
    });
  });

  if (state.show) {
    return <div className='home__next-show'>
      <div className='home__next-show-deets'>
        <p className="home__next-on-air">Next On Air</p>
        <p className='home__next-show-name'>
          <a href={`/shows/${nextShow().slug}`}>
            {nextShow().showName}
          </a>
        </p>
        <p className='home__next-show-host'>
          hosted by <a href={`/profile/${usernameById(nextShow().userId)}`}>
            {displayNameById(nextShow().userId)}</a>
        </p>
        <p className='home__next-show-time'>
          {startEndTime(nextShow().startHour,
            nextShow().startMinute, nextShow().endHour,
            nextShow().endMinute)}
        </p>
      </div>
      <a href="/shows">
        <div className=
          'home__next-show-link color-button transparent-button'>
          Program Schedule
        </div>
      </a>
    </div>;
  }
  else return null;
}

export default HomeSidebarNext;
