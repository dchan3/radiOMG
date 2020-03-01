import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Playlists from '../../../api/playlists/playlists_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Metamorph } from 'react-metamorph';
import { filter, uniq, map, pluck } from 'underscore';
import { $ } from 'meteor/jquery';
import useSubscribe from '../../hooks/useSubscribe';

function ShowPage() {
  let [state, setState] = useState({
    playlistLoaded: false
  });

  let showState = useSubscribe(null, function(fxn) {
    let slug = FlowRouter.getParam('slug');

    return Meteor.subscribe('singleShow', slug, {
      onReady: function() {
        let show = Shows.findOne({ slug });
        if (show) {
          Meteor.subscribe('userById', show.userId);
          Meteor.subscribe('showPlaylists', show.showId, {
            onReady: function() {
              fxn({ actualPlaylist: function(playlistData) {
                if (playlistData === undefined) return [];
                let retval = playlistData;
                retval.sort(function(a,b) {
                  if (a.start > b.start) {
                    return 1;
                  }
                  else if (a.start < b.start) {
                    return -1;
                  }
                  else return 0;
                });
                return retval;
              },
              show: Shows.findOne({ slug: FlowRouter.getParam('slug') }),
              pastPlaylists: function(showId) {
                return Playlists.find({ showId },
                  { sort: { showDate: -1 }, skip: 1 }).fetch()
              },
              playlistsByYear: (showId) => {
                let playlistDates = Playlists.find({ showId }, { sort: {
                    showDate: -1 }, skip: 1 }).fetch(),
                  uniqDates = uniq(map(pluck(playlistDates,
                    'showDate'), (obj) => obj.getFullYear()), true,
                  (date) => +date),
                  a = [];
                for (let p = 0; p < uniqDates.length; p++) {
                  let r = {};
                  r.year = uniqDates[p];
                  r.shows = filter(playlistDates,
                    (obj) => obj.showDate.getFullYear() === uniqDates[p]);
                  a.push(r);
                }
                return a;
              }
              });
            }
          });
        }
        else {
          FlowRouter.go('/not-found');
          return;
        }
      }
    });
  })

  function day(num) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
      'Saturday'][num];
  }

  function isPlaying(mp3) {
    return global.player.getSrc() === mp3 && !global.player.getPaused();
  }

  function toLocal(timeStr, f) {
    return momentUtil(moment(momentUtil(timeStr, 'HH:mm'),
      'Pacific/Honolulu')).format(f)
  }

  function timeBeautify(startHour, startMinute, endHour, endMinute) {
    if (startMinute === 1) {
      startMinute--;
    }
    if (endMinute === 59) {
      endHour = (endHour + 1) % 24;
      endMinute = 0;
    }
    var ap = startHour > endHour;
    if (ap) ap = 'h:mmA';
    else ap = 'h:mm';

    return `${
      toLocal(`${startHour}:${startMinute}`, ap)}-${
      toLocal(`${endHour}:${endMinute}`, 'h:mmA')}`;
  }

  function time(t) {
    return momentUtil(t).format('ddd. MMM. D, YYYY');
  }

  function timeBeautify2(time) {
    return momentUtil(
      moment(momentUtil(time)).tz('Pacific/Honolulu')).format('hh:mma');
  }

  function handlePlayClick(event) {
    event.preventDefault();
    var mp3Url = $(event.target).data('path');
    var nowLoaded = player.getSrc();

    if (nowLoaded != mp3Url) {
      $('.mejs__time-slider').css('visibility', 'visible');
      $('.mejs__broadcast').css('visibility', 'hidden');
      player.setSrc(mp3Url);
      var message = `Now playing the latest episode of ${
        showState.show.showName}`;
      Session.set('defaultLoaded', false);
      player.setSrc(mp3Url);
      if (!Session.get('playedStream')) Session.set('playedStream', true);
      Bert.alert(message, 'default', 'growl-top-right', 'fa-music');
    }

    if (player.paused) {
      player.play();
    }
    else if (!player.paused) {
      player.pause();
    }
  }

  function handleSelectChange(event) {
    FlowRouter.go(`/playlists/${$(event.target).val()}`);
  }

  function handleProfileClick() {
    var id = Shows.findOne({ slug: FlowRouter.getParam('slug') }).userId;
    var user = Meteor.users.findOne({ _id: id });
    if (user !== undefined) FlowRouter.go(`/profile/${user.username}`);
  }

  function latestPlaylist() {
    if (!showState) return null;
    let { show } = showState;
    if (!show) return null;
    let { showId } = show;
    return Playlists.findOne({ showId }, { $sort: { showDate: -1 } });
  }

  function requestSpinData() {
    var latest = latestPlaylist();

    if (latest) {
      let parsedId = parseInt(latest.spinPlaylistId, 10);
      if (parsedId < 10000) {
        Meteor.call('getPlaylistOrInfo', parsedId, true,
          function(error, result) {
            if (!error && result) {
              Session.set('currentPlaylist',
                JSON.parse(result.content).results);
              setState({ playlistLoaded: true })
            }
          });
      }
      else {
        Meteor.call('getPlaylistSpins', parsedId,
          function(error, result) {
            if (!error && result) {
              Session.set('currentPlaylist', result.data.items);
              setState({ playlistLoaded: true });
            }
          });
      }
    }
  }

  useEffect(function() {
    if (state.playlistLoaded) {
      setState({ playlistLoaded: false });
    }
  }, [state.playlistLoaded]);

  if (showState) {
    let { show, pastPlaylists, playlistsByYear, actualPlaylist } = showState,
      { showName, host, featuredImage, thumbnail, genres, startHour,
        startMinute, endHour, endMinute, startDay, latestEpisodeUrl }
      = show;
    if (!state.playlistLoaded) requestSpinData();
    return [
      <Metamorph
        title={`${showName} - KTUH FM Honolulu | Radio for the People`}
        description={`${showName} on KTUH`}
        image={thumbnail || 'https://ktuh.org/img/ktuh-logo.jpg'} />,
      <h2 className='general__header' key='header-title'>
        <b>{showName} / {host}</b>
      </h2>,
      <div className='show__link' key='shows-link'>
        <a href='/shows' className='back-to'>← Show Schedule</a>
      </div>,
      <div className="show__wrapper" key='show-wrapper'>
        <div className="show__content">
          {featuredImage &&
          <div className='show__image-div'>
            <img className='show__image'
              src={thumbnail || (featuredImage && featuredImage.url)} />
          </div> || null}
          <div className='show__info'>
            <h5 className='show__time'>
              {day(startDay)}{'s from '}
              {timeBeautify(startHour, startMinute, endHour, endMinute)}
            </h5>
            {genres && genres.length && <div className='show-item__genres'>
              <span className='glyphicon glyphicon-music'></span>
              {` ${genres.join(', ')}`}</div> || null}
            <div className='show__buttons'>
              {latestEpisodeUrl &&
              <div className='button__wrapper'>
                <p className='show__tag'>
                  <button type="button" data-path={latestEpisodeUrl} className=
                    'btn btn-default show__play-btn color-button purple-button'
                  onClick={handlePlayClick} aria-label="Left Align">
                    <span className={`glyphicon ${isPlaying(latestEpisodeUrl) &&
                    'glyphicon-pause' || 'glyphicon-play'}`} aria-hidden="true">
                    </span> {' '}Play latest episode
                  </button>
                </p>
              </div> || null}
              <div className='button__wrapper'>
                <p className='show__host'>
                  <button type="button" className={'btn btn-default ' +
                    'goto-dj-profile color-button purple-button'}
                  onClick={handleProfileClick}
                  aria-label="Left Align">
                    DJ Profile
                  </button>
                </p>
              </div>
            </div>
            <p className='show__body' dangerouslySetInnerHTML=
              {{ __html: show.body }} />
          </div>
        </div>
      </div>,
      latestPlaylist() && (
        <div className='show__latest' key='latest-episode'>
          <h5 className='show__latest-header'>Latest Episode</h5>
          <h2 className='show__latest-date'>
            {time(latestPlaylist().showDate)}
          </h2>
          {pastPlaylists(show.showId).length && (
            <select onChange={handleSelectChange}>
              <option value="" disabled={true} selected={true}>
              Past Playlists &#x25BC;
              </option>
              {playlistsByYear(show.showId)
                .map(({ year, shows }) => ([
                  <option value={`${year}`} disabled={true}
                    key={`${year}`}>
                    {year}</option>,
                  shows.map(({ spinPlaylistId, showDate }, i) => (
                    <option value={spinPlaylistId} key={i}>
                      {time(showDate)}
                    </option>))
                ]))}
            </select>) || null}
          <div className='show__latest-playlist' key='latest-playlist'>
            <table className='playlist'>
              <thead>
                <tr className='playlist__info-row'>
                  <td><b>
                    <i className="fa fa-clock-o" aria-hidden="true"></i>
                  </b></td>
                  <td><b>Artist</b></td>
                  <td><b>Title</b></td>
                </tr>
              </thead>
              <tbody>
                {actualPlaylist(Session.get('currentPlaylist')).map(({
                  start, artist, song, Timestamp, ArtistName, SongName },
                i) => (
                  <tr className='alternating' key={i}>
                    {start && [
                      <td className='playlist__timestamp'
                        key={`timestamp-${i}`}>
                        {timeBeautify2(start)}
                      </td>,
                      <td className='playlist__artist' key={`artist-${i}`}>
                        {artist}</td>,
                      <td className='playlist__title' key={`title-${i}`}><i>
                        {song}</i></td>
                    ] || [
                      <td className='playlist__timestamp'
                        key={`artist-${i}`}>
                        {timeBeautify2(Timestamp)}
                      </td>,
                      <td className='playlist__artist' key={`artist-${i}`}>
                        {ArtistName}</td>,
                      <td className='playlist__title' key={`title-${i}`}>
                        <i>{SongName}</i></td>
                    ]}
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>) || null];
  }
  else return null;
}


export default ShowPage;
