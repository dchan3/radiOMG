import React from 'react';
import { Meteor } from 'meteor/meteor';
import Profiles from '../../../api/users/profiles_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Metamorph } from 'react-metamorph';
import { usernameById } from '../../../startup/lib/helpers.js';
import useSubscribe from '../../hooks/useSubscribe';

function StaffItem({ dj: { userId, name } }) {
  return <div className='staff__item'>
    <h4>
      <a className="staff__item-textlink" href=
        {`/profile/${usernameById(userId)}`}>
        {name}
      </a>
    </h4>
  </div>;
}

function Staff() {
  let state = useSubscribe({
    djs: []
  },function(fxn) {
    Meteor.subscribe('djProfiles', {
      onReady: function() {
        Meteor.subscribe('djs', {
          onReady: function() {
            Meteor.subscribe('activeShows', {
              onReady: function() {
                fxn({
                  djs: Profiles.find({
                    userId: {
                      $in: Shows.find().fetch().map((show) => show.userId) }
                  }, { sort: { name: 1 } }).fetch()
                });
              }
            });
          }
        });
      }
    });
  });

  if (state.djs.length) {
    return [<Metamorph title="Staff - KTUH FM Honolulu | Radio for the People"
      description="KTUH Staff List"
      image='https://ktuh.org/img/ktuh-logo.jpg' />,
    <h2 className='general__header'>KTUH Staff</h2>,
    <div className='staff__content' key="staff-content">
      {state.djs.map((dj) => <StaffItem {...{ dj }} />)}
    </div>];
  }
  else return null;
}

export default Staff;
