import React from 'react';

export default function ProfileSocialLink(url, handle, icon) {
  if (handle) return <a href={`${url}${handle}`}>
    <img className='profile__social-icon' src={`/img/${icon}.png`} /></a>
  else return null;
}