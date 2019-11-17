import React from 'react';

export default function PartyItem({ party: {
  title, slug, thumbnail, flyerFront } }) {
  return (
    <div className='events-item'>
      <a href={`/events/${slug}`}>
        <img className='events-item__photo' src={thumbnail || flyerFront.url} />
      </a>
      <p><a href={`/events/${slug}`}>{title}</a></p>
    </div>
  );
}
