import React from 'react';
import PlaylistSidebar from './PlaylistSidebar.jsx';
import PlaylistTable from './PlaylistTable.jsx';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Metamorph } from 'react-metamorph';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {
  PlaylistViewProvider, usePlaylistViewContext
} from './PlaylistViewContext';

function PlaylistPage() {
  let { playlistData, playlist, showInfo } = usePlaylistViewContext();

  function showDateOfLatestPlaylist(date) {
    return momentUtil(moment(date).tz('Pacific/Honolulu')).format('LL');
  }

  function showTime(playlist) {
    return playlist && (`${(momentUtil(
      moment(
        momentUtil(playlist.startTime, 'HH:mm:ss')).tz('Pacific/Honolulu'))
    ).format('h:mm')}-${momentUtil(
      moment(momentUtil(playlist.endTime, 'HH:mm:ss'))
        .tz('Pacific/Honolulu')).format('h:mm a')}`);
  }

  if (playlist) {
    let { djName, showDate } = playlist,
      dateOfLatest = showDateOfLatestPlaylist(showDate),
      showStr = showInfo ? `${showInfo.showName} - ${dateOfLatest}` :
        `${showTime(playlist)} Sub Show with ${djName}`;

    return [
      <Metamorph title={`${showStr} - KTUH FM Honolulu | Radio for the People`}
        description={showStr} image={showInfo.thumbnail ||
          'https://ktuh.org/img/ktuh-logo.png'} />,
      <h2 className='general__header'>
        {showInfo &&
            [<a href={`/shows/${showInfo.slug}`}>
              {showInfo.showName}
            </a>, ` playlist - ${
              showDateOfLatestPlaylist(showDate)}`] ||
            [`${showTime(playlist)} w/ ${djName
            } playlist - ${showDateOfLatestPlaylist(showDate)}`]}
      </h2>,
      <div className='playlist__link'>
        <a href='/playlists' className='back-to'>← Back to Playlists</a>
      </div>,
      <div className='playlist__content'>
        {showInfo ? <a href={`/shows/${showInfo.slug}`}>
          <img className='playlist__show-image' src={(showInfo.thumbnail ||
            (showInfo.featuredImage && showInfo.featuredImage.url) :
            'https://ktuh.org/img/ktuh-logo.jpg')} />
        </a> : null}
        <PlaylistTable tracks={playlistData} onPage={true}/>
      </div>,
      <PlaylistSidebar />];
  }
  else return null;
}

export default () => (
  <PlaylistViewProvider currentPlaylist={
    parseInt(FlowRouter.getParam('id'), 10)
  }><PlaylistPage /></PlaylistViewProvider>);
