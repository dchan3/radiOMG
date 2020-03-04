import React, { useContext } from 'react';
import { currentPlaylistFindOne, currentShow, getLocalTime,
  usernameFromDisplayName } from '../../../startup/lib/helpers.js';
import NowPlaying from '../../../api/playlists/now_playing.js';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { $ } from 'meteor/jquery';
import useSubscribe from '../../hooks/useSubscribe';
import PlayingContext from '../../contexts/PlayingContext';

function isSubShow() {
  var show = currentShow();
  var playlist = currentPlaylistFindOne();
  if (show && playlist) {
    return show.host !== playlist.djName;
  }
  else {
    return false;
  }
}

function showActualHost() {
  var show = currentShow(), playlist = currentPlaylistFindOne();
  if (show && playlist) {
    if (show.host === playlist.djName) {
      return show.host;
    }
    else if (show.host !== playlist.djName) {
      return playlist.djName;
    }
  }
  else if (show && !playlist) {
    return show.host;
  }
  else if (playlist && !show) {
    return playlist.djName;
  }
  else return undefined;
}

function LandingInfo({ nowPlaying }) {
  function timeout(foo) {
    return foo ? getLocalTime().diff(momentUtil(
      moment(foo.timestamp, 'Pacific/Honolulu'))
    ) > 360000 : false;
  }

  function whatsNowPlaying() {
    if (nowPlaying && !timeout(nowPlaying))
      return nowPlaying.current;
    else return false;
  }

  function currentShowName() {
    return <p className='landing__show-name caps' key='landing-show-name'>
      <a href={`/shows/${currentShow().slug}`}>
        {currentShow().showName}
      </a>
    </p>
  }

  function currentShowHost() {
    var hostDisplayName = showActualHost() || currentShow().host, hostUsername =
      usernameFromDisplayName(isSubShow() ? showActualHost() :
        currentShow().host) || undefined;

    return <p className='landing__show-host caps' key='landing-show-host'>
      with{' '}
      {hostUsername ?
        <a href={`/profile/${hostUsername}`}>
          {hostDisplayName}
        </a> : hostDisplayName}
    </p>;
  }

  function renderNowPlaying() {
    var nowPlaying = whatsNowPlaying().split(' - '),
      artist = nowPlaying[0], title = nowPlaying[1];

    return [
      <p className="landing__song-title caps"
        key='landing-song-title'>
        {title}
      </p>,
      <p className="landing__song-artist caps" key='landing-sort-artist'>
        {` by ${artist}`}
      </p>
    ];
  }

  let content = null;

  if (currentShow() && whatsNowPlaying()) {
    content = [currentShowName(), currentShowHost(), renderNowPlaying()];
  }
  else if (whatsNowPlaying()) {
    content = [<p className='landing__now-playing' key='landing-onair-text'>
      On Air Now:</p>, renderNowPlaying()];
  }
  else if (currentShow()) {
    content = [currentShowName(), currentShowHost()];
  }
  else {
    content = [
      <p className='landing__show-host' key='landing-show-host'>
        <b>Welcome to KTUH<br />FM Honolulu</b>
      </p>,
      <p className='landing__host-name' key="landing-host-name">
        Radio for the People</p>]
  }

  return <div className='landing__info'>
    {content}
  </div>;
}

function LandingPlayBtn() {
  let { playing, src, setPlaying, setSrc } = useContext(PlayingContext);

  function handlePlayBtn() {
    if (src !== 'http://stream.ktuh.org:8000/stream-mp3') {
      setSrc('http://stream.ktuh.org:8000/stream-mp3');
      setPlaying(true);
      return;
    }

    if (!playing) {
      setPlaying(true);
      return;
    }
    else {
      setPlaying(false);
      return;
    }
  }

  let landingPlaying =
    src === 'http://stream.ktuh.org:8000/stream-mp3' && playing;

  return <div className='landing__play-btn-outer'
    onClick={handlePlayBtn}>
    {landingPlaying ? [
      <div className='landing__pause-btn-l'
        key='pause-button-left'></div>,
      <div className='landing__pause-btn-r'
        key='pause-button-right'></div>
    ] : (
      <div className='landing__play-btn' key='play-button'>
        <div className='landing__play-btn-triangle'></div>
      </div>
    )}
  </div>
}

function Landing() {
  let np = useSubscribe({
    nowPlaying: null
  }, function(fxn) {
    return Meteor.subscribe('nowPlaying', { onReady: function() {
      fxn({ nowPlaying: NowPlaying.findOne() });
      Meteor.subscribe('showNowPlaying', {
        onReady: function() {
          Meteor.subscribe('currentPlaylist', {
            onReady: function() {
              var playlist = currentPlaylistFindOne();
              var show = currentShow();
              if (show && playlist) {
                if (show.host === playlist.djName) {
                  Meteor.subscribe('userById', show.userId);
                  Meteor.subscribe('profileData', show.userId);
                }
                else if (show.host !== playlist.djName) {
                  Meteor.subscribe('userByDisplayName', playlist.djName);
                }
              }
              else if (show && !playlist) {
                Meteor.subscribe('userById', show.userId);
                Meteor.subscribe('profileData', show.userId);
              }
            }
          });
        }
      });
    } });
  });

  function background() {
    var h = getLocalTime().hour();

    if (h >= 6 && h < 18) {
      return 'url(\'/img/tantalus-morning.jpg\')';
    }
    else if ((h >= 18 && h <= 23) || (h >= 0 && h < 6)) {
      return 'url(\'/img/tantalus-evening.jpg\')';
    }
  }

  function handleClickDownArrow() {
    var position = $('#main').offset().top;
    var navHeight = $('.navbar-header').height();
    $('HTML, BODY').animate({ scrollTop: position - navHeight + 2 }, 600);
  }

  return <div className='landing' style={{ backgroundImage: background() }}>
    <div className='landing__box'>
      <LandingPlayBtn />
      <LandingInfo host={showActualHost()} nowPlaying={np.nowPlaying} />
    </div>
    <h4 className='landing__freq landing__hnl-freq'>90.1 FM Honolulu</h4>
    <h4 className='landing__freq landing__ns-freq'>91.1 FM Waialua </h4>
    <a href='/playlists'>
      <h6 className='landing__current-playlist'>
        <span className='landing__view-current'>
          View Current{' '}
        </span>Playlist{'  '}
        <span className='glyphicon glyphicon-eye-open'></span>
      </h6>
    </a>
    <div className='landing__down-arrow'
      onClick={handleClickDownArrow}></div>
  </div>;
}

export default Landing;
