import React, { Component } from 'react';
import { currentPlaylistFindOne } from '../../../startup/lib/helpers.js';
import { Meteor } from 'meteor/meteor';
import PlaylistSidebar from './PlaylistSidebar.jsx';
import PlaylistTable from './PlaylistTable.jsx';
import Shows from '../../../api/shows/shows_collection.js';
import Profiles from '../../../api/users/profiles_collection.js';
import Playlists from '../../../api/playlists/playlists_collection.js';
import { withTracker } from 'meteor/react-meteor-data';
import { moment as momentUtil } from 'meteor/momentjs:moment';
import moment from 'moment-timezone';
import { Session } from 'meteor/session';
import { Helmet } from 'react-helmet';

class PlaylistList extends Component {
  showByShowId() {
    return Shows.findOne({
      showId: this.props.currentPlaylist.showId
    });
  }

  isPlaylistCurrent() {
    var current = currentPlaylistFindOne();
    return current !== undefined;
  }

  showTime(startDay, startHour) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    return days[startDay] + 's at ' +
      momentUtil().hour(startHour).format('h A');
  }

  actualShowHost(showId) {
    var showHost = Shows.findOne({ showId: showId }).host;
    var playlistDJ = Playlists.findOne({}, { sort: { showDate: -1 } }).djName;
    if (showHost !== playlistDJ) return playlistDJ;
    else return showHost;
  }

  timeHMS(date, startTime, endTime) {
    return momentUtil(moment(date, 'Pacific/Honolulu'))
      .format('ddd. MMM DD, YYYY') + ' ' +
      momentUtil(startTime, 'HH:mm:ss')
        .format('hh:mm') +  '-' +
      momentUtil(endTime, 'HH:mm:ss')
        .format('hh:mm A');
  }

  truncated(str) {
    return
    (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{4}/.exec(str) === null) &&
      str.substring(0, str.length - 3) || str;
  }

  usernameFromDisplayName(name) {
    var profile = Profiles.findOne({ name: name });
    var user = profile && Meteor.users.findOne({ _id: profile.userId });
    return user && user.username;
  }

  usernameById(id) {
    var user = Meteor.users.findOne({ _id: id });
    if (user) return user.username;
    else return undefined;
  }

  renderHost(show) {
    if (this.usernameById(show.userId)) {
      if (this.actualShowHost(show.showId)) {
        return [this.showTime(show.startDay, show.startHour) +
        ' • Hosted by ', <a href={'/profile/' + this.usernameById(show.userId)}>
          {this.actualShowHost(show.showId)}
        </a>];
      }
      else return [this.showTime(latestShow.startDay, latestShow.startHour) +
      ' • Hosted by ', <a href={`/profile/${this.usernameById(show.userId)}`}>
        {show.host}</a>];
    }
    else if (this.props.currentPlaylist) {
      return [this.timeHMS(this.props.currentPlaylist.showDate,
        this.props.currentPlaylist.startTime,
        this.props.currentPlaylist.endTime) + ' • Hosted by ',
      (this.usernameFromDisplayName(this.props.currentPlaylist.djName) && (
        <a href={'/profile/' + this.usernameFromDisplayName(
          this.props.currentPlaylist.djName)}>
          {this.props.currentPlaylist.djName}
        </a>) || this.props.currentPlaylist.djName)];
    }
    else return null;
  }

  render() {
    var self = this, showByShowId = this.showByShowId.bind(this);
    if (this.props.ready) {
      var latestShow = showByShowId(this.props.currentPlaylist.showId);
      return [
        <Helmet key="metadata">
          <title>
            Show Playlists - KTUH FM Honolulu | Radio for the People</title>
          <meta property="og:title"
            content="Show Playlists - KTUH FM Honolulu | Radio for the People"
          />
          <meta property="og:description" content="KTUH Show Playlists" />
          <meta name="twitter:title" content={'Show Playlists' +
            ' - KTUH FM Honolulu | Radio for the People'} />
          <meta name="twitter:url" content="https://ktuh.org" />
          <meta name="twitter:description" content="KTUH Show Playlists" />
          <meta name="twitter:site" content="@ktuh_fm" />
          <meta name="twitter:image" content={
            'https://ktuh.org/img/ktuh-logo.jpg'} />
          <meta name="twitter:creator" content="@ktuh_fm" />
          <meta property="description" content="KTUH Show Playlists" />
        </Helmet>,
        <h2 className='general__header' key='header-title'>Playlists</h2>,
        <div className='playlist-list__latest' key='playlist-content'>
          {latestShow && latestShow.thumbnail && (
            <a href={`/shows/${latestShow.slug}`}>
              <img className='playlist__show-image'
                src={latestShow.thumbnail} />
            </a>)}
          <h5 className='playlist-list__current'>
            {this.isPlaylistCurrent() &&
              'CURRENT PLAYLIST' || 'LAST LOGGED PLAYLIST'}
          </h5>
          <h3 className='playlist-list__show-name'>
            {latestShow && ((latestShow.slug && latestShow.showName) &&
                <a href={`/shows/${latestShow.slug}`}>
                  {latestShow.showName}
                </a> || latestShow.showName || 'Sub Show')}
          </h3>
          {latestShow && latestShow.synopsis &&
            <p>{latestShow.synopsis}</p> || null}
          <h5 className='playlist-list__show-host'>
            {latestShow &&
              (this.renderHost(latestShow))}
          </h5>
          <PlaylistTable tracks={this.props.songs || []} onPage={false}/>
        </div>,
        <PlaylistSidebar key='playlist-sidebar' />
      ];
    }
    else return null;
  }
};

export default withTracker(() => {
  var s1 = Meteor.subscribe('activeShows'),
    s2 = Meteor.subscribe('currentPlaylist', {
      onReady: function() {
        var playlist = Playlists.findOne({},
            { limit: 1, sort: { showDate: -1 } }),
          show = Shows.findOne({ showId: playlist.showId }),
          showId = show && show.showId || -1;

        if (showId > -1) {
          Meteor.subscribe('userById', show.userId);
          Meteor.subscribe('profileData', show.userId);
        }
        else {
          Meteor.subscribe('profileDataByUsername', playlist.djName);
          Meteor.subscribe('userByDisplayName', playlist.djName);
        }

        var parsedId = parseInt(playlist.spinPlaylistId);

        if (parsedId > 10000) {
          Meteor.call('getPlaylistSpins', parsedId,
            function(error, result) {
              if (!error && result) {
                Session.set('currentPlaylist', result.data.items);
                Session.set('playlistViewing', parsedId);
              }
            });
        }
        else {
          Meteor.call('getPlaylistOrInfo', parsedId, true,
            function(error, result) {
              if (!error && result) {
                Session.set('currentPlaylist',
                  JSON.parse(result.content).results);
                Session.set('playlistViewing', parsedId);
              }
            });
        }
      }
    });

  return {
    ready: s1.ready() && s2.ready(),
    currentPlaylist: Playlists.findOne({}, { sort: { showDate: -1 } }),
    songs: Session.get('currentPlaylist') || []
  };
})(PlaylistList);
