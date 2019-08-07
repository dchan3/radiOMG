import React from 'react';
import { object, array } from 'prop-types';
import Posts from '../../../api/posts/posts_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Metamorph } from 'react-metamorph';
import ProfileSocialLink from './ProfileSocialLink.jsx';

function SSRProfilePage({ profile, show, posts }) {
  if (profile !== undefined && !profile.banned) {
    let { name, photo, thumbnail, website, twitter, facebook, snapchat,
      soundcloud, instagram } = profile;
    return [<Metamorph description={`${name}'s Profile`} title={`${name
    }'s Profile - KTUH FM Honolulu | Radio for the People`}
    image={photo && photo.url || 'https://ktuh.org/img/ktuh-logo.jpg'} />,
    <h2 className='general__header'>{name}</h2>,
    <div className='profile'>
      <div className='profile__left'>
        {photo && <img className='profile__pic' src={thumbnail || photo.url} />
        || null}
        {(website || twitter || facebook || snapchat || soundcloud ||
          instagram) &&
          (<div className='profile__social-icons'>
            {[
              ['', website, 'website'],
              ['http://soundcloud.com/', soundcloud, 'soundcloud'],
              ['http://instagram.com/', instagram, 'instagram'],
              ['http://facebook.com/', facebook, 'facebook'],
              ['http://twitter.com/', twitter, 'twitter'],
              ['http://snapchat.com/add/', snapchat, 'snapchat']
            ].map((params) => ProfileSocialLink(...params))}
          </div>) || null}
        {show && <div className='profile__show-link'>
          <a className='color-button white-button profile__show-button'
            href={`/shows/${show.slug}`}>View Show Page</a>
        </div> || null}
      </div>
      <div className='profile__info'> <div className='profile__bio'
        dangerouslySetInnerHTML={{ __html: profile.bio ||
        `<i>(${name} hasn't filled out a bio yet.)</i>` }} />
      {posts && posts.length && <div className='profile__posts'>
        <h4>Posts</h4>
        {posts.map(({ _id, slug, title }) => <p key={_id}
          className='profile__posts'>
          <a href={`/radioblog/${slug}`}>{title}</a></p>)}</div> || null}
      </div>
    </div>];
  }
  else {
    return <p>This user does not have a profile.</p>;
  }
}

SSRProfilePage.propTypes = {
  profile: object,
  show: object,
  posts: array
};

export default (profile) => <SSRProfilePage profile={profile}
  posts={Posts.find({ userId: profile.userId })}
  show={Shows.findOne({ userId: profile.userId })}/>;
