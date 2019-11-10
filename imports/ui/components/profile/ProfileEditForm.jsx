import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Profiles from '../../../api/users/profiles_collection.js';
import { $ } from 'meteor/jquery';
import 'meteor/summernote:standalone';
import { scorpius } from 'meteor/scorpiusjs:core';
import { Bert } from 'meteor/themeteorchef:bert';

export default function ProfileEditForm({ doc }) {
  let [state, setState] = useState(doc || {
    name: '',
    website: '',
    soundcloud: '',
    instagram: '',
    facebook: '',
    twitter: '',
    snapchat: '',
    bio: '',
    photo: {
      url: ''
    }
  });

  useEffect(function() {
    $('#summernote').summernote();
    $('.note-editable.panel-body').html(state.bio);
  }, []);

  function updateCollection(data) {
    if ($('.note-editable.panel-body').html() !== '') {
      data.bio = $('.note-editable.panel-body').html();
    }

    Profiles.update({ _id: doc._id }, { $set: data });
  }

  function handleChange(changes) {
    var newState = Object.assign({}, state);
    for (var change in changes) {
      newState[change] = changes[change];
    }
    setState(newState);
  }

  function uploadHelper(files) {
    setState({ ready: false, value: state.value });
    if (scorpius.filesystem.isUploading()) return;
    let upload = scorpius.filesystem.upload({
      fileList: files,
      name: files[0].name,
      uploader: 'image-attribute'
    });
    Tracker.autorun(function(comp) {
      if (upload.ready()) {
        if (upload.error) {
          Bert.alert('There was an error uploading the image.');
        }
        if (upload.progress() === 100) {
          handleChange({ photo: { url: upload.url } });
          comp.stop();
        }
      }
    });
  }

  function handleUploadChange(event) {
    uploadHelper(event.target.files);
  }

  var {
    name, website, soundcloud, instagram, facebook, twitter, snapchat, photo } =
    state;

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      updateCollection(state);
      FlowRouter.go(`/profile/${Meteor.user().username}`);
    }}>
      <h4 className="profile-edit__label">Display Name</h4>
      <input type='text'
        onChange={(e) => handleChange({ name: e.target.value })} value={name} />

      <h4 className="profile-edit__label">Profile Photo</h4>
      <div>
        <div><img id="urlImage" src={photo && photo.url || ''} /></div>
        <input type="file" onChange={(event) => handleUploadChange(event)} />
        <input type="text" disabled={true} value={photo && photo.url || ''} />
      </div>

      <h4 className="profile-edit__label">Bio</h4>
      <div id="summernote" />

      <h4 className="profile-edit__label">Website</h4>
      <input type='text' value={website} />

      <h4 className="profile-edit__label">SoundCloud Handle</h4>
      <input type='text' value={soundcloud} />

      <h4 className="profile-edit__label">Instagram Handle</h4>
      <input type='text' value={instagram} />

      <h4 className="profile-edit__label">Facebook Handle</h4>
      <input type='text' value={facebook} />

      <h4 className="profile-edit__label">Twitter Handle</h4>
      <input type='text' value={twitter} />

      <h4 className="profile-edit__label">Snapchat Handle</h4>
      <input type='text' value={snapchat} />

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}

ProfileEditForm.propTypes = {
  doc: object
};
