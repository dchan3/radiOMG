import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import ProfileEditForm from './ProfileEditForm.jsx';
import Profiles from '../../../api/users/profiles_collection.js';

function ProfileEdit() {
  let [state, setState] = useState({
    profile: null
  });

  useEffect(function() {
    var userId = Meteor.userId();
    Meteor.subscribe('profileData', userId, { onReady: function() {
      setState({
        profile: userId ? Profiles.findOne({ userId }) : {}
      });
    } });
  }, [state.profile]);

  return state.profile ? <div id="main">
    <h2 className='general__header'>Edit Profile</h2>
    <div className='profile-edit'>
      {state.profile && <ProfileEditForm doc={state.profile} /> || null}
    </div>
  </div> : <p>Please login (or signup) to edit your profile.</p>;
}

export default ProfileEdit;
