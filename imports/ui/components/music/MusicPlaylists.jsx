import React from 'react';
import Playlists from '../../../api/playlists/playlists_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Meteor } from 'meteor/meteor';
import { default as momentUtil } from 'moment';
import EverAfter from 'react-everafter';
import useSubscribe from '../../hooks/useSubscribe';

function MusicPlaylists(){
  let state = useSubscribe({
    playlists: []
  }, function (fxn) {
    return Meteor.subscribe('playlists', {
      onReady: function() {
        fxn({
          playlists: Playlists.find({}, { sort: { showDate: -1 } }).fetch()
        });
      }
    });
  });

  function showFromId(showId) {
    return Shows.findOne({ showId });
  }

  if (state.playlists.length) {
    return <div className='music__playlists'>
      <h2>Playlists</h2>
      <div>
        <EverAfter.TablePaginator items={state.playlists} perPage={7}
          truncate={true} className="playlist-list" columns={[{
            headerText: '',
            display: ({ showId }) =>
              <img className="music__playlist-image" height="150px"
                src={showId && showFromId(showId).featuredImage.url ||
                  '/mstile-150x150.png'} />
          },
          {
            headerText: 'Show',
            display: ({ showId }) => showId > -1 &&
              showFromId(showId).showName || 'Sub Show'
          },
          {
            headerText: 'Date',
            display: ({ spinPlaylistId, showDate }) =>
              <a href={`/playlists/${spinPlaylistId}`}>
                {momentUtil(showDate).format('MMMM DD, YYYY')}</a>
          }]}/>
      </div>
    </div>;
  }
  else return null;
}

export default MusicPlaylists;
