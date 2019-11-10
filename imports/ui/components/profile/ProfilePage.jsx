import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Posts from '../../../api/posts/posts_collection.js';
import Profiles from '../../../api/users/profiles_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Metamorph } from 'react-metamorph';
import ProfileSocialLink from './ProfileSocialLink.jsx';

function ProfilePage() {
  function toggleBan() {
    if (Meteor.user().hasRole('admin')) {
      let username = FlowRouter.getParam('username'),
        user = Meteor.users.findOne({ username }),
        profile = Profiles.findOne({ userId: user._id });
      Profiles.update(profile._id, { $set: { banned: !profile.banned } });
      Bert.alert(
        `User @${username} ${profile.banned ? 'un' : ''}banned.`, 'default');
    }
  }

  useEffect(() => {}, [Meteor.user() && Meteor.user().hasRole('admin')]);

  let [state, setState] = useState({
    profile: null,
    posts: [],
    show: null
  });

  useEffect(function() {
    let username = FlowRouter.getParam('username');

    Meteor.subscribe('userData', username, {
      onReady: function() {
        let user = Meteor.users.findOne({ username: username });
        if (user !== undefined) {
          Meteor.subscribe('profileData', user._id, { onReady: function() {
            Meteor.subscribe('showByUserId', user._id, { onReady: function() {
              Meteor.subscribe('postsByUser', username, {
                onReady: function() {
                  setState({
                    profile: Profiles.findOne({ userId: user._id }),
                    posts: Posts.find({}, { sort: { submitted: -1 } }).fetch(),
                    show: Shows.findOne({ userId: user._id })
                  });
                }
              });
            }
            });
          }
          });
        }
      }
    });
  }, [state.profile]);

  if (state.profile && !state.profile.banned) {
    let { name, photo, userId, thumbnail, website, twitter, facebook,
      snapchat, instagram, soundcloud, banned, bio } = state.profile;
    return [<Metamorph title={`${name
    }'s Profile - KTUH FM Honolulu | Radio for the People`}
    description={`${name}'s Profile`} image={photo && photo.url ||
      'https://ktuh.org/img/ktuh-logo.jpg'} />,
    <h2 className='general__header'>{name}</h2>,
    <div className='profile'>
      {Meteor.userId() && userId === Meteor.userId() && (<div>
        <a href='/profile'><button type='button'
          className='btn btn-default btn-md party-header__button'>
          <span className='glyphicon glyphicon-edit' aria-hidden='true'>
          </span>Edit</button>
        </a>
      </div>) || null}
      <div className='profile__left'>
        <img className='profile__pic' src={thumbnail || (photo && photo.url) ||
          'https://ktuh.org/img/ktuh-logo.jpg' || null} />
        {(website || twitter || facebook || snapchat || soundcloud || instagram)
          && (<div className='profile__social-icons'>
            {[
              ['', website, 'website'],
              ['http://soundcloud.com/', soundcloud, 'soundcloud'],
              ['http://instagram.com/', instagram, 'instagram'],
              ['http://facebook.com/', facebook, 'facebook'],
              ['http://twitter.com/', twitter, 'twitter'],
              ['http://snapchat.com/add/', snapchat, 'snapchat']
            ].map((params) => ProfileSocialLink(...params))}
          </div>) || null}
        {!!state.show &&
          <div className='profile__show-link'>
            <a className='color-button white-button profile__show-button'
              href={`/shows/${state.show.slug}`}>View Show Page</a>
          </div> || null}
      </div>
      <div className='profile__info'>
        <div className='profile__bio' dangerouslySetInnerHTML={{ __html: bio ||
          `<i>(${name} hasn't filled out a bio yet.)</i>` }} />
        {state.posts && state.posts.length && <div className='profile__posts'>
          <h4>Posts</h4>
          {state.posts.map(({ slug, title, _id }) =>
            <p key={_id} className='profile__posts'>
              <a href={`/radioblog/${slug}`}>{title}</a>
            </p>)}
        </div> || null}
        {(Meteor.user() && Meteor.user().hasRole('admin') && userId !==
          Meteor.userId()) && <input id='profile__ban-user' type="button"
          value={banned ?  'Lift User Ban' : 'Ban User'} onClick={toggleBan} />
          || null}
      </div>
    </div>];
  }
  else {
    return <p>This user does not have a profile.</p>;
  }
}

export default ProfilePage;
