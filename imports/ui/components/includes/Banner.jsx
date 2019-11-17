import React from 'react';
import { Meteor } from 'meteor/meteor';
import { getLocalTime } from '../../../startup/lib/helpers.js';
import Notices from '../../../api/notices/notices_collection.js';
import useSubscribe from '../../hooks/useSubscribe';

function Banner() {
  function within(start, end) {
    let now = getLocalTime().toDate();
    return start < now && now < end;
  }

  let state = useSubscribe({
    notice: null
  }, function (fxn) {
    return Meteor.subscribe('notices', {
      onReady: function() {
        fxn({ notice: Notices.findOne({}) });
      }
    });
  });

  if (state.notice && within(state.notice.startDatetime,
    state.notice.endDatetime)) {
    return <div className='banner-container'>
      <div className={`banner ${
        ['light', 'medium', 'dark'][state.notice.severity]}`}
      dangerouslySetInnerHTML={{ __html: state.notice.body }} /></div>;
  }
  else return null;
}

export default Banner;
