import React, { createContext, useState, useEffect, useContext } from 'react';
import { requestSpinDataSync } from '../../../startup/lib/helpers.js';
import Playlists from '../../../api/playlists/playlists_collection';
import Shows from '../../../api/shows/shows_collection';
import { Meteor } from 'meteor/meteor';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';

let initialState = -1;
const PlaylistViewContext = createContext(initialState);

export default PlaylistViewContext;

const { Provider } = PlaylistViewContext;

export const PlaylistViewProvider = ({ children, currentPlaylist }) => {
  let [playlistData, setPlaylistData] = useState([]);

  let [playlistView, setPlaylistView]
    = useState(currentPlaylist ? currentPlaylist : initialState);

  let [showInfo, setShowInfo] = useState('not found');

  let [playlist, setPlaylist] = useState(null);

  let [showStr, setShowStr] = useState('');

  let [header, setHeader] = useState('');

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

  useEffect(function() {
    if (playlistView > -1)
      Meteor.subscribe('playlist', playlistView, {
        onReady: function() {
          let playlistOne = Playlists.findOne({ spinPlaylistId: playlistView });
          Meteor.subscribe('djs');
          Meteor.subscribe('djProfiles');
          Meteor.subscribe('activeShows', {
            onReady: async function () {
              let res = await requestSpinDataSync(playlistOne.spinPlaylistId);
              setPlaylistData(res);

              let show = null, pl = playlistOne;
              if (pl && pl.showId > -1) {
                show = Shows.findOne({ showId: pl.showId });
              }

              setShowInfo(show || 'not found');
              setPlaylist(pl);
              if (show) setHeader(`${show.showName} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
              else setHeader(`${showTime(pl)} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
            }
          });
        }
      })
      else Meteor.subscribe('lastPlaylist', {
        onReady: function() {
          let playlistOne = Playlists.findOne({
          }, { sort: { showDate: -1, startTime: -1 } });
          Meteor.subscribe('djs');
          Meteor.subscribe('djProfiles');
          Meteor.subscribe('activeShows', {
            onReady: async function () {
            let res = await requestSpinDataSync(playlistOne.spinPlaylistId);
            setPlaylistData(res);
              let show = null, pl = playlistOne;
              if (pl && pl.showId > -1) {
                show = Shows.findOne({ showId: pl.showId });
              }

              setShowInfo(show || 'not found');
              setPlaylist(pl);
              if (show) setHeader(`${show.showName} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
              else setHeader(`${showTime(pl)} w/ ${
                pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
            }
          });
        }
      });
  }, []);

  useEffect(function() {
    if (playlistView > -1)
      Meteor.subscribe('playlist', playlistView, {
        onReady: function() {
          let playlistOne = Playlists.findOne({ spinPlaylistId: playlistView });
          Meteor.subscribe('djs');
          Meteor.subscribe('djProfiles');
          Meteor.subscribe('activeShows', {
            onReady: async function () {
              let res = await requestSpinDataSync(playlistOne.spinPlaylistId);
              setPlaylistData(res);
              let show = null, pl = playlistOne;
              if (pl && pl.showId > -1) {
                show = Shows.findOne({ showId: pl.showId });
              }

              setShowInfo(show || 'not found');
              setPlaylist(pl);
              if (show) setHeader(`${show.showName} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
              else setHeader(`${showTime(pl)} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
            }
          });
        }
      })
      else Meteor.subscribe('lastPlaylist', {
        onReady: function() {
          let playlistOne = Playlists.findOne({
          }, { sort: { showDate: -1, startTime: -1 } });
          Meteor.subscribe('djs');
          Meteor.subscribe('djProfiles');
          Meteor.subscribe('activeShows', {
            onReady: async function () {
              let res = await requestSpinDataSync(playlistOne.spinPlaylistId);
              setPlaylistData(res);
              let show = null, pl = playlistOne;
              if (pl && pl.showId > -1) {
                show = Shows.findOne({ showId: pl.showId });
              }

              setShowInfo(show || 'not found');
              setPlaylist(pl);
              if (show) setHeader(`${show.showName} w/ ${pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
              else setHeader(`${showTime(pl)} w/ ${
                pl.djName} playlist - ${
                showDateOfLatestPlaylist(pl.showDate)}`);
            }
          });
        }
      });
  }, [playlistView]);

  return <Provider value={{ playlistView,
    setPlaylistView, playlistData, setPlaylistData, playlist, setPlaylist,
    showInfo, setShowInfo, showStr, header }}>{children}</Provider>;
};

export function usePlaylistViewContext() {
  let { playlistView, setPlaylistView, setPlaylistData, playlist, showInfo,
    playlistData, showStr, header } = useContext(PlaylistViewContext);

  return { playlistView,
    setPlaylistView,
    setPlaylistData,
    playlistData,
    playlist,
    showInfo, showStr, header }
}
