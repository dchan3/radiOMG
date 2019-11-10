import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlaylistSidebar from './PlaylistSidebar.jsx';
import PlaylistTable from './PlaylistTable.jsx';
import Playlists from '../../../api/playlists/playlists_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Session } from 'meteor/session';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Metamorph } from 'react-metamorph';
import { FlowRouter } from 'meteor/kadira:flow-router'
import { requestSpinData } from '../../../startup/lib/helpers.js';
import useSubscribe from '../../hooks/useSubscribe';

function PlaylistPage() {
  let [playlistLoaded, setPlaylistLoaded] = useState(false),
    state = useSubscribe({
      playlist: null
    }, function(fxn) {
      let id = parseInt(FlowRouter.getParam('id'), 10);
      Meteor.subscribe('activeShows');
      return Meteor.subscribe('playlist', id, {
        onReady: function() {
          let playlist = Playlists.findOne({ spinPlaylistId: id });
          if (playlist)
            Meteor.subscribe('comments', playlist._id);
          fxn({ playlist });
        }
      });
    });

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

  function showIfAny() {
    return Shows.findOne({ showId: state.playlist.showId });
  }

  useEffect(function() {
    if (playlistLoaded) {
      setPlaylistLoaded(false);
    }
  }, [state.playlist, playlistLoaded]);

  if (state.playlist) {
    let { djName, showDate, spinPlaylistId } = state.playlist,
      show = showIfAny(),
      dateOfLatest = showDateOfLatestPlaylist(showDate),
      showStr = show ? `${show.showName} - ${dateOfLatest}` :
        `${showTime(state.playlist)} Sub Show with ${djName}`;
    if (!playlistLoaded) {
      requestSpinData(spinPlaylistId, (error, result) => {
        if (!error && result) {
          Session.set('currentPlaylist',
            spinPlaylistId > 10000 ? result.data.items :
              JSON.parse(result.content).results);
          Session.set('playlistViewing', spinPlaylistId);
          setPlaylistLoaded(true);
        }
      });
    }

    return [
      <Metamorph title={`${showStr} - KTUH FM Honolulu | Radio for the People`}
        description={showStr} image={show.thumbnail ||
          'https://ktuh.org/img/ktuh-logo.png'} />,
      <h2 className='general__header'>
        {show &&
            [<a href={`/shows/${show.slug}`}>
              {show.showName}
            </a>, ` playlist - ${
              showDateOfLatestPlaylist(showDate)}`] ||
            [`${showTime(state.playlist)} w/ ${djName
            } playlist - ${showDateOfLatestPlaylist(showDate)}`]}
      </h2>,
      <div className='playlist__link'>
        <a href='/playlists' className='back-to'>← Back to Playlists</a>
      </div>,
      <div className='playlist__content'>
        {show ? <a href={`/shows/${show.slug}`}>
          <img className='playlist__show-image' src={(show.thumbnail ||
            (show.featuredImage && show.featuredImage.url) :
            'https://ktuh.org/img/ktuh-logo.jpg')} />
        </a> : null}
        <PlaylistTable tracks={Session.get('currentPlaylist') || []}
          onPage={true}/>
      </div>,
      <PlaylistSidebar />];
  }
  else return null;
}

PlaylistPage.propTypes = {
  playlist: PropTypes.object,
  ready: PropTypes.bool
};

export default PlaylistPage;
