import React from 'react';
import { currentPlaylistFindOne } from
  '../../../startup/lib/helpers.js';
import { Meteor } from 'meteor/meteor';
import PlaylistSidebar from './PlaylistSidebar.jsx';
import PlaylistTable from './PlaylistTable.jsx';
import Profiles from '../../../api/users/profiles_collection.js';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Metamorph } from 'react-metamorph';
import {
  PlaylistViewProvider,
  usePlaylistViewContext
} from './PlaylistViewContext';

function PlaylistList() {
  let { playlistView, playlistData, playlist, showInfo } = usePlaylistViewContext();

  function isPlaylistCurrent() {
    let current = currentPlaylistFindOne();
    return current !== undefined;
  }

  function showTime(startDay, startHour) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    return `${days[startDay]}s at ${
      momentUtil().hour(startHour).format('h A')}`;
  }

  function actualShowHost() {
    return playlist && playlist.djName || '';
  }

  function timeHMS(date, startTime, endTime) {
    return `${momentUtil(moment(date, 'Pacific/Honolulu'))
      .format('ddd. MMM DD, YYYY')} ${momentUtil(startTime, 'HH:mm:ss')
      .format('hh:mm')}-${momentUtil(endTime, 'HH:mm:ss').format('hh:mm A')}`;
  }

  function usernameFromDisplayName(name) {
    var profile = Profiles.findOne({ name });
    var user = profile && Meteor.users.findOne({ _id: profile.userId }) || null;
    return user && user.username || null;
  }

  function usernameById(id) {
    var user = Meteor.users.findOne({ _id: id });
    if (user) return user.username;
    else return undefined;
  }

  function renderHost(show) {
    var { userId, showId, startDay, startHour, host } = show;

    if (!playlist) return null;
    var { showDate, startTime, endTime, djName } = playlist,
      latestShow = showInfo;

    if (usernameById(userId)) {
      if (actualShowHost(showId)) {
        return [`${showTime(startDay, startHour)} • Hosted by `,
          <a href={`/profile/${usernameById(userId)}`}>
            {actualShowHost(showId)}
          </a>];
      } else return [`${
        showTime(latestShow.startDay, latestShow.startHour)} • Hosted by `,
      <a href={`/profile/${usernameById(userId)}`}>{host}</a>];
    } else if (playlistView) {
      return [`${timeHMS(showDate, startTime, endTime)} • Hosted by `,
        (usernameFromDisplayName(djName) && (
          <a href={`/profile/${usernameFromDisplayName(djName)}`}>
            {djName}
          </a>) || djName)];
    } else return null;
  }

  if (showInfo) {
    return [
      <Metamorph
        title="Show Playlists - KTUH FM Honolulu | Radio for the People"
        description="KTUH Show Playlists"
        image='https://ktuh.org/img/ktuh-logo.jpg'/>,
      <h2 className='general__header' key='header-title'>Playlists</h2>,
      <div className='playlist-list__latest' key='playlist-content'>
        {showInfo !== 'not found' && showInfo.thumbnail && (
          <a href={`/shows/${showInfo.slug}`}>
            <img className='playlist__show-image' src={showInfo.thumbnail}/>
          </a>) || null}
        <h5 className='playlist-list__current'>
          {isPlaylistCurrent() ?
            'CURRENT PLAYLIST' : 'LAST LOGGED PLAYLIST'}
        </h5>
        <h3 className='playlist-list__show-name'>
          {showInfo !== 'not found' && ((showInfo.slug && showInfo.showName) &&
            <a href={`/shows/${showInfo.slug}`}>
              {showInfo.showName}
            </a> || showInfo.showName || 'Sub Show') || 'Sub Show'}
        </h3>
        {showInfo !== 'not found' &&
          showInfo.synopsis && <p>{showInfo.synopsis}</p> || null}
        <h5 className='playlist-list__show-host'>
          {showInfo !== 'not found' && renderHost(showInfo)
            || playlist && `${
              timeHMS(playlist.showDate, playlist.startTime, playlist.endTime)
            } • Hosted by ${playlist.djName}` || null}
        </h5>
        {playlistData && playlistData.length &&
        <PlaylistTable tracks={playlistData} onPage={false}/> || null}
      </div>,
      <PlaylistSidebar key='playlist-sidebar'/>
    ];
  }
  else return null;
}

export default () => (
  <PlaylistViewProvider><PlaylistList /></PlaylistViewProvider>);
