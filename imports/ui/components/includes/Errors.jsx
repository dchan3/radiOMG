import React, { useEffect } from 'react';
import Errors from '../../../../client/helpers/errors.js';
import Notifications from
  '../../../api/notifications/notifications_collection.js';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import useSubscribe from '../../hooks/useSubscribe';

const IGNORE_CONNECTION_ISSUE_KEY = 'ignoreConnectionIssue';

function Error({ error }) {
  useEffect(function() {
    Meteor.setTimeout(function () {
      Errors.remove(error._id);
    }, 6500);
  }, []);

  return (
    <div className='alert alert-danger' role='alert'>
      <button type='button' className='close' data-dismiss='alert'>
        &times;
      </button>
      {error.message}
    </div>
  );
}

function ErrorsBox() {
  function connected() {
    return Session.get(IGNORE_CONNECTION_ISSUE_KEY) ||
      Meteor.status().connected;
  }

  let state = useSubscribe({
    notifications: [],
    errors: []
  }, function(fxn) {
    return Meteor.subscribe('notifications', {
      onReady: function() {
        fxn({
          errors: Errors.find().fetch(),
          notifications: Notifications.find({
            userId: Meteor.userId(),
            read: false
          }).fetch()
        });
      }
    });
  });

  return [
    <div className='notifications' key='notifications-box'>
      {!connected() ? (
        <div className='notification'>
          <span className='title-notification'>Trying to connect</span>
          <span className='glyphicon glyphicon-refresh'></span>
        </div>) : null}
      {state.notifications.map(({ action, title }) => (
        <div className='notification' key='item'>
          <a className='btn-primary js-notification-action'>{action}</a>
          <div className='title-notification'>{title}</div>
        </div>
      ))}
    </div>,
    <div className='errors' key='errors-box'>
      {state.errors.map((item) =>
        <Error message={item} key={item._id} />
      )}
    </div>];
}

export default ErrorsBox;
