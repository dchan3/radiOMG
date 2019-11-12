import React, { useContext } from 'react';
import Shows from '../../../api/shows/shows_collection.js';
import Playlists from '../../../api/playlists/playlists_collection.js';
import { default as moment } from 'moment';
import { uniq, map, pluck } from 'underscore';
import useSubscribe from '../../hooks/useSubscribe';
import PlaylistViewContext from './PlaylistViewContext';

function PlaylistSidebar() {
  let { playlistView, setPlaylistView } = useContext(PlaylistViewContext),
    state = useSubscribe({
      sidebar: null
    }, function(fxn) {
      return Meteor.subscribe('playlistsLimited', {
        sort: { showDate: -1, spinPlaylistId: -1 }, limit: 12 }, {
        onReady: function() {
          fxn({ sidebar: getSidebarData() });
        }
      });
    }, [playlistView]);

  function getSidebarData() {
    let viewingPlaylistId = playlistView, playlistDates;
    if (viewingPlaylistId) {
      playlistDates = Playlists.find({ spinPlaylistId: {
        $ne: viewingPlaylistId }
      }, {
        sort: { showDate: -1, spinPlaylistId: -1 }, limit: 12
      }).fetch();
    }
    else {
      playlistDates = Playlists.find({}, {
        sort: { showDate: -1, spinPlaylistId: -1 },
        limit: 12
      }).fetch();
    }
    let uniqDates = uniq(map(pluck(playlistDates, 'showDate'),
        (date) => {
          date.setSeconds(0);
          date.setMilliseconds(0);
          date.setHours(0);
          date.setMinutes(0);
          return date;
        }), true, (date) => +date), a = [];
    for (let p = 0; p < uniqDates.length; p++) {
      let r = {};
      r.date = uniqDates[p];
      r.shows = _.filter(playlistDates,
        (obj) => +obj.showDate === +uniqDates[p]);
      a.push(r);
    }
    return a;
  }

  function timeFromHours(h1, m1, h2, m2) {
    if (m2 === 59) {
      h2 = (h2 + 1) % 24;
    }
    var ap = h1 > h2 ? 'hA' : 'h';
    return `${moment(h1, 'HH').format(ap)}-${moment(h2, 'HH').format('hA')}`;
  }

  function timeFromHMS(str1, str2) {
    return `${moment(str1, 'HH:mm:ss').format('h')}-${
      moment(str2, 'HH:mm:ss').format('hA')}`;
  }

  function showById(id) {
    return Shows.findOne({ showId: id });
  }

  function dateFormat(date) {
    return moment(date).format('ddd. MMMM DD, YYYY');
  }

  if (state.sidebar) {
    return (
      <div className='playlist__sidebar corner'>
        <h4 className='playlist__sidebar-header'>Browse Latest</h4>
        {state.sidebar && state.sidebar.map(({ date, shows }) => [
          <hr />,
          <h4 className='playlist__sidebar-date'>
            {dateFormat(date)}
          </h4>,
          shows.map(({ showId, spinPlaylistId, startTime, endTime, djName
          }) => {
            if (showId > -1) {
              let { startMinute, startHour, endHour, endMinute, showName } =
                showById(showId);
              return <div><p className='playlist__sidebar-link'>
                <a href={`/playlists/${spinPlaylistId}`} onClick={() => {
                  setPlaylistView(spinPlaylistId);
                }}>
                  {[timeFromHours(startHour, startMinute, endHour, endMinute),
                    ` ${showName}`] || [
                    `${timeFromHMS(startTime, endTime) } w/ ${djName}`] || null}
                </a>
              </p>
              </div>;
            }
            else {
              return <div><p className='playlist__sidebar-link'>
                <a href={`/playlists/${spinPlaylistId}`} onClick={() => {
                  setPlaylistView(spinPlaylistId);
                }}>
                  {`${timeFromHMS(startTime, endTime) } w/ ${djName}`}
                </a>
              </p>
              </div>;
            }
          })
        ])}
      </div>
    );
  }
  else return null;
}

export default PlaylistSidebar;
