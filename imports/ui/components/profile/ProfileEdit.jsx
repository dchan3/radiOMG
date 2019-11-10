import { Meteor } from 'meteor/meteor';
import React from 'react';
import ProfileEditForm from './ProfileEditForm.jsx';
import Profiles from '../../../api/users/profiles_collection.js';
import useSubscribe from '../../hooks/useSubscribe';

function ProfileEdit() {
  let state = useSubscribe({
    profile: null
  }, function(fxn) {
    let userId = Meteor.userId();
    Meteor.subscribe('profileData', userId, { onReady: function() {
      fxn({
        profile: userId ? Profiles.findOne({ userId }) : {}
      });
    } });
  });

  return state.profile ? <div id="main">
    <h2 className='general__header'>Edit Profile</h2>
    <div className='profile-edit'>
      {state.profile && <ProfileEditForm doc={state.profile} /> || null}
    </div>
  </div> : <p>Please login (or signup) to edit your profile.</p>;
}

export default ProfileEdit;
