import React from 'react';
import { string } from 'prop-types';
import Notifications from
  '../../../api/notifications/notifications_collection.js';

export default function NotificationItem(
  { _id, notificationPostPath, commenterName }) {
  function handleClick() {
    Notifications.update(_id, { $set: { read: true } });
  }

  return <li>
    <a onClick={handleClick} href={notificationPostPath}>
      <strong>{commenterName}</strong> commented on your post
    </a>
  </li>;
}

NotificationItem.propTypes = {
  _id: string,
  notificationPostPath: string,
  commenterName: string
};
