import React, { createContext, useState, useContext } from 'react';
import { requestSpinData } from '../../../startup/lib/helpers.js';
import useSubscribe from '../../hooks/useSubscribe';
import Playlists from '../../../api/playlists/playlists_collection';
import Shows from '../../../api/shows/shows_collection';
import { Meteor } from 'meteor/meteor';

let initialState = -1;
const PlaylistViewContext = createContext(initialState);

export default PlaylistViewContext;

const { Provider } = PlaylistViewContext;

export const PlaylistViewProvider = ({ children, currentPlaylist }) => {
  let [playlistView, setPlaylistView]
    = useState(currentPlaylist ? currentPlaylist : initialState);

  return <Provider value={{ playlistView,
    setPlaylistView }}>{children}</Provider>;
};

export function usePlaylistViewContext() {
  let { playlistView, setPlaylistView } = useContext(PlaylistViewContext),
    state = useSubscribe({
      playlist: null,
      playlistData: [],
      showInfo: null
    }, function(fxn) {
      Meteor.subscribe('activeShows');

      return playlistView > -1
        ? Meteor.subscribe('playlist', playlistView, {
          onReady: function() {
            let playlist = Playlists.findOne();
            Meteor.subscribe('djs');
            Meteor.subscribe('djProfiles');
            Meteor.subscribe('activeShows', {
              onReady: function () {
                let show = null, pl = playlist;
                if (pl && pl.showId > -1) {
                  show = Shows.findOne({ showId: pl.showId });
                }

                requestSpinData(playlist.spinPlaylistId, function(err, res) {
                  fxn({ playlist,
                    playlistData: res && res.data.items,
                    showInfo: show || 'not found' });
                });
              }
            });
          }
        }):
        Meteor.subscribe('lastPlaylist', {
          onReady: function() {
            let playlist = Playlists.findOne();
            Meteor.subscribe('djs');
            Meteor.subscribe('djProfiles');
            Meteor.subscribe('activeShows', {
              onReady: function () {
                let show = null, pl = playlist;
                if (pl && pl.showId > -1) {
                  show = Shows.findOne({ showId: pl.showId });
                }

                requestSpinData(playlist.spinPlaylistId, function(err, res) {
                  fxn({ playlist,
                    playlistData: res && res.data.items,
                    showInfo: show || 'not found' });
                });
              }
            });
          }
        });
    });

  return { playlistView,
    setPlaylistView,
    playlist: state.playlist,
    playlistData: state.playlistData,
    showInfo: state.showInfo };
}