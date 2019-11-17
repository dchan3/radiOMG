import React from 'react';
import { Meteor } from 'meteor/meteor';
import Notifications from
  '../../../api/notifications/notifications_collection.js';
import NotificationItem from './NotificationItem.jsx';
import useSubscribe from '../../hooks/useSubscribe';

function NotificationsBox() {
  let state = useSubscribe({
    notifications: []
  }, function(fxn) {
    fxn({ notifications:
      Notifications.find({ userId: Meteor.userId(), read: false }).fetch()
    });
  })

  return [<a href="#" className="dropdown-toggle" data-toggle="dropdown">
    Notifications
    {state.notifications.length &&
      <span className="badge badge-inverse">
        {state.notifications.length}</span> || null}
    <b className="caret"></b>
  </a>,
  <ul className="notification dropdown-menu">
    {state.notifications.length && state.notifications.map(
      ({ commenterName, notificationPostPath, _id }) =>
        <NotificationItem {...{ commenterName, notificationPostPath, _id }} />)
        || <li><span>No Notifications</span></li>}</ul>];
}

export default NotificationsBox;
