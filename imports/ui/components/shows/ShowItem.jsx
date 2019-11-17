import React from 'react';
import { Meteor } from 'meteor/meteor';
import { default as moment } from 'moment';

export default function ShowItem({ show: { startHour, startMinute, endHour,
  endMinute, slug, thumbnail, featuredImage, showName, userId, host, synopsis,
  genres } }) {
  function formattedTime(startHour, startMinute, endHour, endMinute) {
    if (startMinute === 1) {
      startMinute--;
    }
    if (endMinute === 59) {
      endHour = (endHour + 1) % 24;
      endMinute = 0;
    }
    let amPm = `h${startHour > endHour ? 'A' : ''}`, time =
      `${moment(`${startHour}:${startMinute}`, 'HH:mm').format(amPm)
        .replace('M', '')}-${moment(`${endHour}:${endMinute}`,
        'HH:mm').format('hA')}`;
    return time.substr(0, time.length-1);
  }

  function profileLink(_id) {
    let user = Meteor.users.findOne({ _id });
    if (user) return `/profile/${user.username}`;
  }

  return <div className='show-item'><h4 className='show-item__time'>
    {formattedTime(startHour, startMinute, endHour, endMinute)}</h4>
  <div className='show-item__image-div'>
    <a href={`/shows/${slug}`}>
      <img className='show-item__image' src={thumbnail ||
        (featuredImage && featuredImage.url) ||
      'https://ktuh.org/img/ktuh-logo.jpg'} />
    </a>
  </div>
  <div className='show-item__info-container'>
    <div className='show-item__info'>
      <h5 className='show-item__info-time'>
        {formattedTime(startHour, startMinute, endHour, endMinute)}
      </h5>
      <h4><a href={`/shows/${slug}`}>{showName}</a></h4>
      <h5>Hosted by <a className='show-item__host purple-text' href=
        {profileLink(userId)}>{host}</a></h5>
      <p>{synopsis}</p>
      {genres && genres.length && <div className='show-item__genres'>
        <span className='glyphicon glyphicon-music'></span>
        {` ${genres.join(', ')}`}
      </div> || null }
    </div>
  </div></div>;
}
