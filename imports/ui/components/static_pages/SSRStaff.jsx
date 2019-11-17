import React from 'react';
import Profiles from '../../../api/users/profiles_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Metamorph } from 'react-metamorph';
import { usernameById } from '../../../startup/lib/helpers.js';

function StaffItem({ dj: { userId, name } }) {
  return (
    <div className='staff__item'>
      <h4>
        <a className="staff__item-textlink" href=
          {`/profile/${usernameById(userId)}`}>
          {name}
        </a>
      </h4>
    </div>
  );
}

function Staff({ ready, djs }){
  if (ready) {
    return [
      <Metamorph title="Staff - KTUH FM Honolulu | Radio for the People"
        description="KTUH Staff List" image=
          'https://ktuh.org/img/ktuh-logo.jpg' />,
      <h2 className='general__header'>KTUH Staff</h2>,
      <div className='staff__content' key="staff-content">
        {djs.map((dj) => {
          return <StaffItem key={dj.userId} {...{ dj }} />
        })}
      </div>
    ];
  }
  else return null;
}

export default <Staff
  ready={true} djs={Profiles.find({
    userId: { $in: Shows.find().fetch().map(({ userId }) => userId) }
  }, { sort: { name: 1 } }).fetch() } />
